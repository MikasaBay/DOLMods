iData.addto(
    'extraLink',
    {
        passage: 'Shopping Centre',
        widget: 'daisoEntrance'
    },
    {
        passage: 'Harvest Street',
        widget: 'almondPathEntry'
    },
    {
        passage: 'Orphanage',
        widget: 'OrphanageCanteenEntrance'
    },
    {
        passage: 'Orphanage',
        widget: 'EatEdenKitchen'
    },
    {
        passage: 'Cabin House Actions',
        widget: 'EatEdenKitchen'
    },
);

iData.addto(
    'beforeLink',
    {
        passage: ['Harvest Street', 'Mer Street'],
        widget: 'chinatownExplore'
    },
    {
        passage: 'Orphanage',
        widget: 'OpenHomeStorage'
    },
    {
        passage: 'Garden',
        widget: 'OpenHomeStorage'
    },
    {
        passage: 'Bathroom',
        widget: 'BathroomOption'
    },
    {
        passage: 'Soup Kitchen',
        widget: 'EatSoupKitchen'
    },

);

iData.addto(
    'psgdone',
    {
        passage: ['Canteen Lunch Robin', 'Canteen Lunch Robin CD 1', 'Robin Kiyoura Start', 'Canteen Lunch Kylar', 'Canteen Lunch Sydney', 'Canteen Lunch'],
        widget: 'fillHungerSchool'
    },
);

/// 咖啡馆
iData.addto(
    'psgdone',
    {
        passage: ['Cafe Coffee Finish'],
        widget: 'drinkCoffeeInCafe'
    },
);
iData.addto(
    'psgdone',
    {
        passage: ['Cafe Eat'],
        widget: 'eatAleSaladInCafe'
    },
);

//不能添加在后面，暂时放前面
iData.addto(
    'psgdone',
    {
        passage: ['Cafe Pancakes'],
        widget: 'eatPancakeInCafe'
    },
);
iData.addto(
    'psgdone',
    {
        passage: ['Cafe Cream Bun'],
        widget: 'eatDeluxeCreamBunInCafe'
    },
);
//孤儿院晚餐
iData.addto(
    'psgdone',
    {
        passage: ['Orphanage Canteen Eat'],
        widget: 'eatDinnerOrphanage'
    },
);
//农场早餐
iData.addto(
    'psgdone',
    {
        passage: ['Farm Breakfast'],
        widget: 'eatBreakfastFarm'
    },
);
//伊甸摩斯综合征
iData.addto(
    'psgdone',
    {
        passage: ['Forest Cabin Food'],
        widget: 'eatCaughtByEden'
    },
);
//伊甸共进晚餐，暂时加在前面。
iData.addto(
    'psgdone',
    {
        passage: ['Eden Dinner'],
        widget: 'eatDinnerEden'
    },
);
// 雷米农场第一次吃草
iData.addto(
    'psgdone',
    {
        passage: ['Livestock Field Intro Grass'],
        widget: 'eatGrassFirstTime'
    },
);
// 雷米农场吃草，不能放在后面，暂时放到前面
iData.addto(
    'psgdone',
    {
        passage: ['Livestock Field Grass'],
        widget: 'eatGrassInField'
    },
);
