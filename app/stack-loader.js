var StorageService = function (sid) {  /* Storage APi*/
    var STORAGE_ID = sid || 'SEARCH-LIST';
    return {
        get: function () {
           // var item = JSON.parse(localStorage.getItem(STORAGE_ID) || []);
            return [
                'AngularJS',
                'Angular2',
                'Babel',
                'Backbone.js',
                'Cordova',
                'CSS',
                'CSS3',
                'D3.js',
                'DOJO',
                'DOM',
                'ECMAScript-6',
                'ESLint',
                'Express',
                'ExtJS',
                'Groovy',
                'GruntJS',
                'Gulp',
                'Hibernate',
                'HTML',
                'HTML5',
                'Internet-explorer-6',
                'Internet-explorer-7',
                'Internet-explorer-8',
                'Internet-explorer-9',
                'Ionic-framework',
                'Jasmine',
                'Java',
                'JavaScript',
                'jQuery',
                'Jquery-UI',
                'JSPM',
                'Karma-runner',
                'MEAN-stack',
                'Meteor',
                'Mocha',
                'MongoDB',
                'mongoDB-query',
                'Mongoose',
                'Node.js',
                'PhantomJS',
                'ReactJS',
                'Ruby',
                'SASS',
                'Sencha-Touch',
                'Spring',
                'Spring-boot',
                'Spring-data',
                'Spring-integration',
                'Spring-mvc',
                'Spring-security',
                'Twitter-bootstrap',
                'Typescript',
                'Webpack'
            ];
        },
        put: function (itm) {
            localStorage.setItem(sid, JSON.stringify(itm));
        }
    }
};


var SearchListModel = function (data) {
    data = data || {};
    this.tag = m.prop(data.tag || "");
};

SearchListModel.list = function () {
    var dataService = StorageService('tags');
    return dataService.get();
};

SearchListModel.save = function (item) {
    var dataService = StorageService('tags');
    return dataService.put(item);
};


var SearchBox = {
    controller: function () {

    },
    view: function (ctrl, args) {
        return m('div.row', [
            m('input[placeholder="Search Text"]',
                {class: 'search-input', oninput: m.withAttr("value", args.searchText), value: args.searchText()})
            ,
            m("button", {onclick: args.onSearchClick}, "Go")

        ])
    }

};
//changes 5

var HomePage = {
    controller: function (args) {
        var list = SearchListModel.list();
        return {
            searchText: m.prop(''),
            onunload: function () {
                console.log("unloading home component");
            },
            errorText: m.prop(''),
            properCase: function (searchText2) {
                return searchText2[0].toUpperCase() + searchText2.slice(1).toLowerCase()
            },
            save: function () {
                if (this.searchText().trim().length == 0) {
                    return;
                }
                var text = this.properCase(this.searchText());
                if (list.includes(text)) {
                    this.errorText("Already Exists");
                    return
                }
                this.errorText("");
                list.push(text);
                this.searchText('');
                SearchListModel.save(list);
            },
            list: function () {
                console.log( JSON.stringify(list));
                return list;
            },
            removeEl: function (e) {
                debugger;
                var ctrl = this;
                var index = $(e.currentTarget).attr('data-index');
                var list = ctrl.list();
                list.splice(index, 1);
                SearchListModel.save(list);
                ctrl.errorText("Removed");
                setTimeout(function () {
                    m.startComputation();
                    ctrl.errorText("");
                    m.endComputation();
                }, 1000);
            }
        };
    },
    view: function (cntrl, args) {
        return m('.container', m("div", [
            //m('.screen', "Mobile"),
            m('h1.heading', "Stack Flow"),
           // m(SearchBox, {onSearchClick: cntrl.save.bind(cntrl), searchText: cntrl.searchText}),
            m('ul',
                cntrl.list().map(function (searchText, index) {
                    return m('li', [
                        m('a[href="/list/' + searchText + '"]', {config: m.route}, searchText),
                      //  m('span.removeEl', {'data-index': index, onclick: cntrl.removeEl.bind(cntrl)}, 'x')
                    ]);
                })
            ),
            m("div.errorText", cntrl.errorText()),
            m('a[href="/list"]', {config: m.route}, '')
        ]));
    }
};


var ListPage = {
    controller: function () {
        var tag = m.route.param("tag");
        var searchURL = ("api/" + tag + ".json").toLowerCase();
        var qlist = m.request({method: "GET", url: searchURL});
        console.log(qlist);
        return {
            tag: tag,
            qList: m.request({method: "GET", url: searchURL}),
            click: function (url) {
                // window.open('http://stackoverflow.com/'+ url ,'_blank');
                console.log(url);
            }

        }
    },
    view: function (cntrl) {

        return m('div', [
            m('div.clistHeading', [m('h2.listHeading', cntrl.tag)
            ]),
            m('div', cntrl.qList().map(function (itm, i) {
                return m('div', [
                    m('div', [
                        m('span.voteCount', 'Votes: ' + itm.vote)
                    ]),
//m('button',{onclick:cntrl.click(itm.link)},m('span',itm.question)) ,
                    m('div.questionContainer', [
                        m('a.questionLink', {
                            href: 'http://stackoverflow.com' + itm.link,
                            target: '_blank'
                        }, m('span', itm.question)),
                    ]),
                    m('div.questionNumber', [m('span.counter', i + 1)])
                    , m('hr')
//m('button',{onclic
                ]);
            })),
            m('a[href="/home"]', {config: m.route}, '<< Back')
        ])
    }
};

var DetailsPage = {
    controller: function () {
        var url = m.route.param("url");
        return {url: url};
    },
    view: function (cntrl) {
            //AKHIL
        return m('div', "Details: " + cntrl.url, [
            m('a[href="/home"]', {config: m.route}, 'Home'),
            m('iframe[src="http://stackoverflow.com/' + cntrl.url + '"]')
        ])
    }
};

var dashboard = {
    controller: function () {
        return {id: m.route.param("userID")};
    },
    view: function (controller) {
        return m("div", controller.id);
    }
};


//setup routes to start w/ the `#` symbol
m.route.mode = "hash";


//define a route
m.route(document.body, "/home", {
    "/home": HomePage,
    "/list/:tag": ListPage,
    "/details/:url...": DetailsPage,
    "/dashboard/:userID": dashboard
});

