// iMod BaseScene DaisoShop
eventManager.registEvent('DaisoShop',
    {
        episode: 'Intro',
        type: 'Event',
        eventnext: true,
        nextcode: '<<=iEvent.unsetEvent()>>',
        require: () => iEvent.getFlag('daiso', 'intro') !== 1 && between(Time.hour, 9, 19) && !iEvent.getFlag('daiso', 'thief')
    },
    {
        episode: 'Lock',
        type: 'Scene',
        eventnext: true,

        nextcode: '<<=iEvent.unsetEvent()>>',
        initcode: '',
        require: () => !between(Time.hour, 8, 19)
    },
    {
        episode: 'Exposed',
        type: 'Event',
        branch: 'Naked',

        priority: 10,

        require: () => V.exposed >= 2 && V.tvar.lastPassage != 'BaseScene DaisoShop' && passage() == 'BaseScene DaisoShop'
    }
);

