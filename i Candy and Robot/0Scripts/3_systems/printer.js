const htmlPrinter = {
    palams : function(palam, value){
        let gl = 'l';
        let count = 1;
        if (value > 0) {
            gl = 'g';
        }
        if (Math.abs(value) > 30) {
            count = 3;
        } else if (Math.abs(value) > 20) {
            count = 2;
        }
        
        if(palam == 'hunger' || palam == 'thirsty'){
            if(Math.abs(value) >= 500 ){
                count = 3;
            }
            else if(Math.abs(value) >= 200 ){
                count = 2;
            }
        }
    
        if(palam == 'hallucinogen'){
            palam = 'hallucinogens'
        }
        if(palam == 'thirsty'){
            palam = 'thirst'
        }
    
        return `<<${gl.repeat(count)}${palam}>>`;
    },

	itemImageResolve : function(item, data, shop){
		if(!item) return 'img/items/item_none.png'
		let size = iM.getStackSize(item.id)

		let img = data.img
		if(item.diff){
			img = `img/items/${data.type}/${data.id}_${item.diff}.png`
		}
		if(data.stacksprites){
			let select = new SelectCase()

			for(let i = 1; i <= data.stacksprites.length; i++){
				let min = data.stacksprites[i-1]
				let max = i == data.stacksprites.length ? 10000 :  data.stacksprites[i] - 1
				let result = `img/items/${data.type}/${data.id}_${min}.png`
				if(item.diff){
					result = `img/items/${data.type}/${data.id}_${item.diff}_${min}.png`
				}
				select.case([min, max], result)
			}
			select.else(data.img)
			img = select.has(Math.floor((item.count/size+0.5)*100))
		}

		if(iCandy.config.debug)
			console.log('image', img, item, data)
		
		if(data.stacksprites && shop){
			let len = data.stacksprites.length
			img = `img/items/${data.type}/${data.id}_${data.stacksprites[len-1]}.png`
		}
		return img
	},

	itemIcons : function(itemId, diff){
		let data = Items.get(itemId)
		let item = { id : itemId, diff : diff, count: data.num }

		let img = this.itemImageResolve(item, data)
		return `<img class='icon' src='${img}'>`
	},

    templet : function(string, ...args){
        for(let i = 0; i < args.length; i++){
            string = string.replaceAll(`{${i}}`, args[i])
        }
        return string
    },	

    pharmacy : function(itemId, diff){
        if(!itemId) return ;

        let drug = Items.get(itemId)
        let linkname = ''
        let name = lanSwitch(drug.name)
        if(diff){
            name += '[' + lanSwitch(drug.diff[diff].displayname)+']'
        }	
    
        if(drug.tags.includes('pill')){
            linkname = `${name}(${drug.num}${lanSwitch('pills per bottle', '粒/瓶')})`
        }
        else if(drug.tags.includes('liquid')){
            linkname = `${name}(${drug.num}ml${lanSwitch(' bottle','瓶装')})`
        }
        else if(drug.tags.includes('cream')){
            linkname = `${name}(${drug.num}ml${lanSwitch('','支装')})`
        }
        else if(drug.tags.includes('inject')){
            linkname = `${name}(${drug.num}${lanSwitch('shots per pack','管/盒')})`
        }
        else{
            linkname = name
        }
 
        return `<<itemIcons '${itemId}' '${diff}'>><<link '${linkname}' 'Shop Pharmacy Sale'>><<set $pharmacyItem to Items.get("${itemId}")>><</link>><br>`
    },

    equipment : function(){
		let html = ``
		const equip = ['held', 'bag', 'wallet', 'cart']
		equip.forEach((slot)=>{
			let item = iM.getEquip(slot)
				html += `<div id='${slot}' class='equipslot'>`
	
				if(item){
					const data = Items.get(item.id)
					let img = this.itemImageResolve(item, data)
					let onclick = ` onClick="V.addMsg += Items.get('${item.id}').onUnEquip(); SugarCube.Engine.play(V.passage)"`
	
					if(!iM.checkItemOnGet(item.id, 1)){
						onclick = ``
					}

					html += `<mouse class="tooltip-tiny"${onclick}>\n`
					html += `	<img class='icon' src="${img}">\n`
					html += `	<span>${lanSwitch(data.info)}\n`
					html += `	<span class="yellow">${getLan('unequip')}</span>`
					html += '	</span>'
					html += '</mouse>'
				}
				else{
					html += `<img class='icon' src="img/items/${slot}_none.png">`
				}
	
				html += `</div>`
		})
	
		return html
    },

    pockets : function(slot){
		let html = ''
		let pocket = V.iPockets[slot]
		let maxslot = iM.getMaxSlots(slot)
		for(let i = 0; i < maxslot; i++){
			const item = pocket[i]
			let data = item ? Items.get(item.id) : null
			if(data && item.diff && data.diff[item.diff].aliasItem){
				data = Items.get(data.diff[item.diff].aliasItem)
			}

			let itemname = data ? lanSwitch(data.name) : ''
			let itemcount = data ? iData.itemUnit(data, item.count) : ''

			let method = data ? lanSwitch( iData.useMethods(data.type, data.tags) ) : ''

			let _html = `<div id='${slot}-${i}' class='pocketslot'>`
			let img = this.itemImageResolve(item, data)

			if(data && item.diff && !item.tags.includes('equip')){
				const diff = data.diff[item.diff]
				itemname = lanSwitch(diff.displayname)
			}

			_html += `<div class='itemname'>${itemname}</div>`
			_html += `<div class='itemcount'>${itemcount}</div>`
			_html += `<div id='${item ? item.uid : 'noitem'}' class='itemicon'>`
				if(item){
					_html += `<mouse class="tooltip-tiny">`
					_html += `	<img class='icon' src="${img}">`
					_html += data ? `	<span>${lanSwitch(data.info)}</span>` : ''
					_html += `</mouse>`
				}
				else{
					_html += `<img class='icon' src="img/items/item_none.png">`
				}
			_html += `</div>`
			if(data && V.combat == 0 && !V.event){
				_html += `<div id='action' class='pocketaction'>
				<span class='itemaction'>`

				if(data.tags.includes('equip')){
					_html += `<<link "${getLan('equip')}" $passage>>
						<<set $addMsg += "<<imgIcon '${img}'>>">>
						<<set $addMsg += Items.get('${data.id}').onEquip('${slot}', '${i}');>>
					<</link>>`
				}
				else if(!data.require && (data.effects.length > 0 || typeof data.onUse == 'function')){
					 _html += `<<link "${method}" "Actions UseItems">>
					 	<<set $tvar.useItem to ["${slot}", ${i}]>>
						<<set $tvar.img to "${img}">>
						<<if $passage.has("Actions UseItems", "Actions DropItems", "Actions TransferItem") is false>>
							<<set $tvar.exitPassage to $passage>>
						<</if>>
						<<run console.log('on use check', $tvar.useItem, $tvar.img, $tvar.exitPassage)>>
					 <</link>>`
				}
				
				_html += `</span>
				<span class='itemaction'>
					<<link "${getLan('move')}">>
						<<set $tvar.transferItem to ["${slot}", ${i}]>>
					<</link>>
				</span>
				<span class='itemaction'>
					<<link "${getLan('drop')}" $passage>>
						<<run iM.dropItem("${slot}", ${i})>>
					<</link>>
				</span>
				</div>`
			}
			_html += `</div>`

			//if(iCandy.config.debug)
				console.log(_html);

			html += _html
		}
		return html
    },

	storage : function(postion){
		let html = ''
		const storage = V.iStorage[postion]
	}

}


//------------------------------------------------------------
//
// Export namespace
//
//------------------------------------------------------------

window.htmlPrinter = htmlPrinter
Object.defineProperty(window, 'P', { get : function(){ return htmlPrinter }})


//------------------------------------------------------------
//
// Macro
//
//------------------------------------------------------------

function itemIcons(itemId, diff){
	if(diff == 'undefined') diff = undefined	
	if(V.options.images == 1){
		return P.itemIcons(itemId, diff)
	}
	return ''
}


DefineMacroS('itemIcons', itemIcons)
DefineMacroS('iMedicineLink', htmlPrinter.pharmacy)