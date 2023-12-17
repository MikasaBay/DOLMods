setup.DOLNPCNames = {
    Avery: ["Avery", "艾弗利"],
    Bailey: ["Bailey", "贝利"],
    Briar: ["Briar", "布莱尔"],
    Charlie: ["Charlie", "查理"],
    Darryl: ["Darryl", "达里尔"],
    Doren: ["Doren", "多伦"],
    Eden: ["Eden", "伊甸"],
    Gwylan: ["Gwylan", "格威岚"],
    Harper: ["Harper", "哈珀"],
    Jordan: ["Jordan", "约旦"],
    Kylar: ["Kylar", "凯莱尔"],
    Landry: ["Landry", "兰德里"],
    Leighton: ["Leighton", "礼顿"],
    Mason: ["Mason", "梅森"],
    Morgan: ["Morgan", "摩根"],
    River: ["River", "瑞沃"],
    Robin: ["Robin", "罗宾"],
    Sam: ["Sam", "萨姆"],
    Sirris: ["Sirris", "西里斯"],
    Whitney: ["Whitney", "惠特尼"],
    Winter: ["Winter", "温特"],
    "Black Wolf": ["Black Wolf", "黑狼"],
    Niki: ["Niki", "尼奇"],
    Quinn: ["Quinn", "奎恩"],
    Remy: ["Remy", "雷米"],
    Alex: ["Alex", "艾利克斯"],
    "Great Hawk": ["Great Hawk", "巨鹰"],
    Wren: ["Wren", "伦恩"],
    Sydney: ["Sydney", "悉尼"],
    "Ivory Wraith": ["Ivory Wraith", "白色幽灵"],
    Zephyr: ["Zephyr", "泽菲尔"],
  };

function lanSwitch(...lan) {
    let [EN, CN] = lan
    if (Array.isArray(lan[0]))
        [EN, CN] = lan[0]

    if (setup.language == 'CN') {
        return CN ?? EN
    }
    return EN ?? CN
}
window.lanSwitch = lanSwitch
DefineMacroS('lanSwitch', lanSwitch)


let lancheck = setInterval(() => {
    if (typeof setup !== 'object') { return }

    if (window.modI18N || setup.breastsizes[1] == '微隆的') {
        setup.language = 'CN'
    }
    else {
        setup.language = 'EN'
    }

    if (setup.language == 'CN' || (setup.language == 'EN' && setup.breastsizes[1] !== '微隆的')) {
        clearInterval(lancheck)
        $(document).trigger('languageChecked')
    }
}, 60)


class NamedNPC {
    static database = []
    /**
     * 
     * @param {NamedNPC} npc 
     */
    static add(...npc) {
        this.database.push(...npc)
    }
    static clear() {
        //- 清理非法NPC
        let newnpcs = []
        for (let i = 0; i < V.NPCName.length; i++) {
            let npc = V.NPCName[i]

            if (setup.NPCNameList.includes(npc.nam)) {
                newnpcs.push(V.NPCName[i])
            }
        }
        V.NPCName = newnpcs
        V.NPCNameList = setup.NPCNameList
    }
    static has(name) {
        return this.database.findIndex((npc) => { return npc.nam == name })
    }
    static update() {
        this.database.forEach((data) => {
            let npc = clone(data)
            if (V.NPCNameList.includes(npc.nam) === false) {
                npc.title = lanSwitch(npc.title_lan)
                npc.displayname = lanSwitch(npc.displayname_lan)

                if (!V.NPCName.find(chara => chara.nam == npc.nam)) {
                    V.NPCName.push(npc)
                }
                if (!setup.NPCNameList.includes(npc.nam)) {
                    setup.NPCNameList.push(npc.nam)
                }
                if (!V.NPCNameList.includes(npc.nam)) {
                    V.NPCNameList.push(npc.nam)
                }

                if (!C.npc[npc.nam]) {
                    Object.defineProperty(C.npc, npc.nam, {
                        get() {
                            return V.NPCName[setup.NPCNameList.indexOf(npc.nam)];
                        },
                        set(val) {
                            V.NPCName[setup.NPCNameList.indexOf(npc.nam)] = val;
                        },
                    })
                }
            }
        })

        //按setup的顺序重新排序
        const { npcs, list } = setup.NPCNameList.reduce((res, npc)=>{
            let index = setup.NPCNameList.indexOf(npc)
            res.list[index] = npc;
            let [data] = V.NPCName.filter(data => data.nam == npc )
            res.npcs[index] = data;
            return res
        }, { npcs:[], list:[] })

        V.NPCName = npcs;
        V.NPCNameList = list
        

        V.NPCName.forEach((npc) => {
            if (npc.displayname == undefined && setup.DOLNPCNames[npc.nam]) {
                npc.displayname = npc.nam
                npc.displayname_lan = setup.DOLNPCNames[npc.nam]
            }
            else if(npc.displayname_lan == undefined && npc.description_lan){
                npc.displayname_lan = npc.description_lan
                npc.displayname = lanSwitch(npc.displayname_lan)
            }
        })
    }
    static switchlan() {
        V.NPCName.forEach((npc) => {
            if (npc.title_lan) {
                npc.title = lanSwitch(npc.title_lan)
            }
            if (npc.displayname_lan) {
                npc.displayname = lanSwitch(npc.displayname_lan)
            }
        })
    }
    static init() {
        this.update()
        console.log('addNamedNPC', 'init mod npc from storyinit', V.NPCName, setup.NPCNameList)
    }
    static reset(npc) {
        let data = new NamedNPC(npc.nam, npc.title, npc.des, npc.type)
        for (let i in npc) {
            data[i] = npc[i]
        }
        return data
    }
    constructor(name, title, des, type) {
        this.nam = name
        this.description = name
        this.title_lan = title
        this.displayname_lan = des
        this.type = type

        this.penis = 0
        this.vagina = 0
        this.insecurity = 'none'
        this.pronoun = 'none'
        this.penissize = 0
        this.penisdesc = 'none'
        this.bottomsize = 0
        this.ballssize = 0
        this.breastsize = 0
        this.breastdesc = 0
        this.breastsdesc = 0

        this.skincolour = 0
        this.teen = 0
        this.adult = 1
        this.init = 0
        this.intro = 0
        this.trust = 0
        this.love = 0
        this.dom = 0
        this.lust = 0
        this.rage = 0
        this.state = ''
        this.trauma = 0

        this.eyeColour = ''
        this.hairColour = ''

        this.chastity = { penis: '', vagina: '', anus: '' }

        this.purity = 0
        this.corruption = 0

        this.pregnancy = {}
        this.pregnancyAvoidance = 100

        this.virginity = {
            anal: false,
            oral: false,
            penile: false,
            vaginal: false,
            handholding: false,
            temple: false,
            kiss: false
        }
    }
    Init(gender, age) {
        this.setGender(gender)
        this.setAge(age)

        return this
    }
    setAge(age) {
        if (age == 'teen') {
            this.teen = 1
            this.adult = 0
        }
        else {
            this.adult = 1
            this.teen = 0
        }
        return this
    }
    setValue(key, value) {
        this[key] = value;
        return this
    }
    setPronouns(gender) {
        if (gender == 'm') {
            this.pronouns = {
                he: 'he',
                his: 'his',
                hers: 'hers',
                him: 'him',
                himself: 'himself',
                man: 'man',
                boy: 'boy',
                men: 'men',
            }
        }
        else {
            this.pronouns = {
                he: 'she',
                his: 'her',
                hers: 'hers',
                him: 'her',
                himself: 'herself',
                man: 'woman',
                boy: 'girl',
                men: 'women',
            }
        }
        return this
    }
    setGender(gender) {
        this.gender = gender
        this.penis = gender == 'm' ? 'clothed' : 'none'
        this.penissize = 3
        this.penisdesc = 'penis'
        this.vagina = gender == 'm' ? 'none' : 'clothed'
        this.pronoun = gender
        this.setPronouns()
        return this
    }
    setPenis(size, des) {
        this.penissize = size
        this.penisdesc = des
        return this
    }
    setBreasts(size, des, desc) {
        this.breastsize = size
        this.breastdesc = des
        this.breastsdesc = desc
        return this
    }
    setColour(skin, eye, hair) {
        this.skincolour = skin
        this.eyeColour = eye
        this.hairColour = hair
        return this
    }
    setVirginity(object) {
        for (let i in object) {
            this.virginity[i] = object[i]
        }
        return this
    }
    setPregnancy() {
        let pregnancy = {
            fetus: [],
            givenBirth: 0,
            totalBirthEvents: 0,
            timer: null,
            timerEnd: null,
            waterBreaking: null,
            npcAwareOf: null,
            pcAwareOf: null,
            type: null,
            enabled: true,
            cycleDaysTotal: random(24, 32),
            cycleDay: 0,
            cycleDangerousDay: 10,
            sperm: [],
            potentialFathers: [],
            nonCycleRng: [
                random(0, 3), random(0, 3)
            ],
            pills: null
        }

        pregnancy.cycleDay = random(1, pregnancy.cycleDaysTotal)
        pregnancy.cycleDangerousDay = 10

        this.pregnancy = pregnancy
        this.pregnancyAvoidance = 50
        return this
    }
    setCustomPronouns(object) {
        for (let i in object) {
            this.pronouns[i] = object[i]
        }
        return this
    }
    isImportant() {
        setup.ModNpcImportant.push(this.nam)
        return this
    }
    isSpecial() {
        setup.ModNpcSpecial.push(this.nam)
        return this
    }
}

window.NamedNPC = NamedNPC;
setup.addNPCList = [];
setup.ModNpcSetting = {};
setup.ModNpcImportant = [];
setup.ModNpcSpecial = [];
setup.ModTraits = [];
setup.ModTraitTitle = [];

setup.ModSocialSetting = function () {
    //make a bakup
    const config = clone(setup.ModNpcSetting)

    //init the options
    for(const[npc, settings] of Object.entries(setup.ModNpcSetting)){
        for(const[key, option] of Object.entries(settings)){
            if(typeof option == 'function'){
                settings[key] = option()
            }
            if(typeof option == 'object'){
                for(let i in option){
                    let value = option[i]
                    if(typeof value == 'function'){
                        option[i] = value()
                    }
                    if(Array.isArray(value) && i == 'displayname'){
                        option.name = lanSwitch(value)
                    }
                }
            }
        }
    }
    Object.assign(T.npcConfig, setup.ModNpcSetting)

    const extra = Object.entries(setup.ModNpcSetting).reduce(( list ,[npcname, config])=>{
        if(config.important){
            list.push(npcname)
        }
        return list
    }, [])

    T.importantNpcOrder.push(...extra)
    T.specialNPCs.push(...setup.ModNpcSpecial)

    //reset the configs
    setup.ModNpcSetting = config
}

setup.ModLoveInterest = function(){
    //把列表塞npc对照表
    T.npc.push(...setup.ModNpcImportant)

    //根据条件塞入可选项
    setup.ModNpcImportant.forEach((npc)=>{
        let config = setup.ModNpcSetting[npc]
        if(config && typeof config.loveInterest == 'function'){
            if(config.loveInterest()){
                T.potentialLoveInterests.push(npc)
            }
        }
        else if(config && typeof config.loveInterest == 'boolean'){
            if(config.loveInterest){
                T.potentialLoveInterests.push(npc)
            }
        }
        else{
            T.potentialLoveInterests.push(npc)
        }
    })

    T.loveInterestSelections = {};
    let non = lanSwitch('None', '没有人')
    T.loveInterestSelections[non] = 'None'
    
    T.potentialLoveInterests.forEach((nnpc)=>{
        let key = C.npc[nnpc].displayname
        T.loveInterestSelections[key] = nnpc
    })
    
}

setup.addModTrait = function () {
    let Traits = [
        'General Traits',
        'Special Traits',
        'School Traits',
        'Trauma Traits',
        'NPC Traits',
        'Hypnosis Traits',
        'Acceptance Traits'
    ]

    console.log(Traits)

    setup.ModTraitTitle.forEach((option) => {
        if (String(option) == `[object Object]`) {
            T.traitLists.push({
                title: lanSwitch(option.display),
                traits: Array.isArray(option.traits) ? option.traits : []
            })

            Traits.push(option.title)
        }
    })

    setup.ModTraits.forEach((trait) => {
        let { addto, name, cond, text, colour } = trait;

        let index = Traits.indexOf(addto)
        let option = {
            name: lanSwitch(name),
            has: typeof cond == 'function' ? cond() : cond,
            text: lanSwitch(text),
            colour,
        }

        console.log(option, addto, index)

        T.traitLists[index].traits.push(option)
    })

}

setup.NPCFrameworkOnLoad = false

function checkUpdate() {
    setup.NPCFrameworkOnLoad = true
}

Save.onLoad.add(checkUpdate)

//读档时的处理
$(document).on(':passageinit', () => {
    if (setup.NPCFrameworkOnLoad === true && V.passage !== 'Start') {
        setTimeout(() => {
            NamedNPC.clear()
            NamedNPC.update()
        }, 60)
        setup.NPCFrameworkOnLoad = false
    }

})

$(document).on(':switchlanguage', () => {
    NamedNPC.switchlan()
})