const mockItems = {
  goodies: [],
  maybes: [{
    id: '273089', title: 'Hard Dubstep - Tedbone', author: 'TedBone', tags: ['145 bpm', 'Dubstep Loops', 'Drum Loops', '2.23 MB', 'wav', 'Key : Unknown', 'Reaper'], desc: 'Description : Enjoy !', url: 'https://www.looperman.com/loops/detail/273089',
  }, {
    id: '273088', title: 'Dubstep Trap - Tedbone', author: 'TedBone', tags: ['140 bpm', 'Dubstep Loops', 'Drum Loops', '6.92 MB', 'wav', 'Key : Unknown', 'Reaper'], desc: 'Description : Enjoy !', url: 'https://www.looperman.com/loops/detail/273088',
  }, {
    id: '273087', title: 'Skrillex Type 02 - Tedbone', author: 'TedBone', tags: ['156 bpm', 'Dubstep Loops', 'Drum Loops', '2.07 MB', 'wav', 'Key : Unknown', 'Reaper'], desc: 'Description : Enjoy !', url: 'https://www.looperman.com/loops/detail/273087',
  }, {
    id: '273086', title: 'Skrillex Type 01 - Tedbone', author: 'TedBone', tags: ['156 bpm', 'Dubstep Loops', 'Drum Loops', '4.14 MB', 'wav', 'Key : Unknown', 'Reaper'], desc: 'Description : Enjoy !', url: 'https://www.looperman.com/loops/detail/273086',
  }, {
    id: '273175', title: 'Drill Drums I Pop Smoke X Tion Wayne', author: 'TheGovvner', tags: ['145 bpm', 'UK Drill Loops', 'Drum Loops', '2.23 MB', 'wav', 'Key : Unknown', 'FL Studio'], desc: 'Description : Have fun with this loop and create some fire.', url: 'https://www.looperman.com/loops/detail/273175',
  }, {
    id: '273159', title: 'Hardstyle Kick With Variation', author: 'ErisedyM', tags: ['156 bpm', 'Hardstyle Loops', 'Drum Loops', '2.07 MB', 'wav', 'Key : E', 'FL Studio'], desc: 'Description : I never stumbled across this here and I know how many people love Hardstyle. So here you go ;)', url: 'https://www.looperman.com/loops/detail/273159',
  }, {
    id: '273156', title: 'Lil Baby X Gunna 808 Drum Loop Prod Helpless', author: 'prodhelpless', tags: ['112 bpm', 'Trap Loops', 'Drum Loops', '5.78 MB', 'wav', 'Key : Dm', 'Logic Pro'], desc: 'Description : Lil Baby X Gunna 808 drum Loop prod helpless', url: 'https://www.looperman.com/loops/detail/273156',
  }, {
    id: '273154', title: 'Timberland Type Drums', author: 'alexattheball', tags: ['111 bpm', 'Hip Hop Loops', 'Drum Loops', '1.46 MB', 'wav', 'Key : Unknown', 'FL Studio'], desc: 'Description : Timberland type drums. Percussion loop,\nGroovy drums. Use it for whatever you want and comment what you´ve made with it.\nMade in FL Studio.\nHave fun', url: 'https://www.looperman.com/loops/detail/273154',
  }, {
    id: '273125', title: 'Oldschool Hip Hop Real Live Drums', author: 'thechockehold', tags: ['110 bpm', 'Hip Hop Loops', 'Drum Loops', '4.41 MB', 'wav', 'Key : Unknown', 'Logic Pro'], desc: 'Description : See my profile info to get my TRUMPET, SAXOPHONE and other sample packs!\nPlease carefully read the information in my profile first before contacting me.\nMIX of some real drums performed my real drummer, sturated with REAL 15ips tape to get that vintage warmth.', url: 'https://www.looperman.com/loops/detail/273125',
  }, {
    id: '273112', title: 'Old School Drums 90 Bpm', author: 'latarnik1', tags: ['90 bpm', 'Hip Hop Loops', 'Drum Loops', '1.79 MB', 'wav', 'Key : Unknown', 'FL Studio'], desc: 'Description : Old school drums made in fl studio. Enjoy', url: 'https://www.looperman.com/loops/detail/273112',
  }, {
    id: '273101', title: '86 BPM Drum Loop', author: 'zonkymob', tags: ['86 bpm', 'Boom Bap Loops', 'Drum Loops', '1.88 MB', 'wav', 'Key : Unknown', 'LMMS'], desc: 'Description : enjoy :)', url: 'https://www.looperman.com/loops/detail/273101',
  }, {
    id: '273099', title: '91 BPM Drum Loop II', author: 'zonkymob', tags: ['91 bpm', 'Boom Bap Loops', 'Drum Loops', '908.54 KB', 'wav', 'Key : Unknown', 'LMMS'], desc: 'Description : enjoy :)', url: 'https://www.looperman.com/loops/detail/273099',
  }, {
    id: '273094', title: '88 BPM Drum Loop II', author: 'zonkymob', tags: ['88 bpm', 'Boom Bap Loops', 'Drum Loops', '1.84 MB', 'wav', 'Key : Unknown', 'LMMS'], desc: 'Description : enjoy :)', url: 'https://www.looperman.com/loops/detail/273094',
  }, {
    id: '273078', title: 'Red Eyes Drum- Tedbone', author: 'TedBone', tags: ['100 bpm', 'Trap Loops', 'Drum Loops', '1.62 MB', 'wav', 'Key : Unknown', 'Reaper'], desc: 'Description : Enjoy !', url: 'https://www.looperman.com/loops/detail/273078',
  }, {
    id: '272942', title: 'UK Drill Rondodasosa Drums Pt 2 - Flame Beatz', author: 'laflamex23', tags: ['145 bpm', 'UK Drill Loops', 'Drum Loops', '4.46 MB', 'wav', 'Key : C#m', 'FL Studio'], desc: 'Description : UK Drill Rondodasosa Drums Pt 2, comment what u did!\nHit me up on ig for loops and collabs.', url: 'https://www.looperman.com/loops/detail/272942',
  }, {
    id: '272941', title: 'UK Drill Rondodasosa Drums Pt 1 - Flame Beatz', author: 'laflamex23', tags: ['145 bpm', 'UK Drill Loops', 'Drum Loops', '4.46 MB', 'wav', 'Key : C#m', 'FL Studio'], desc: 'Description : UK Drill Rondodasosa Drums Pt 1, comment what u did!\nHit me up on ig for loops and collabs.\nCheck PT.2 on my profile!', url: 'https://www.looperman.com/loops/detail/272941',
  }],
};

module.exports = {
  mockItems,
};
