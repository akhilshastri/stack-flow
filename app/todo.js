var todo = {};

//for simplicity, we use this component to namespace the model classes

//the Todo class has two properties
todo.Todo = function(data) {
    this.description = m.prop(data.description);
    this.done = m.prop(false);
};

//the TodoList class is a list of Todo's
todo.TodoList = Array;


//define the view-model
todo.vm = (function() {
    var vm = {} ;
    vm.init = function() {
        //a running list of todos
        vm.list = new todo.TodoList();

        //a slot to store the name of a new todo before it is created
        vm.description = m.prop("");

        //adds a todo to the list, and clears the description field for user convenience
        vm.add = function() {
            if (vm.description()) {
                vm.list.push(new todo.Todo({description: vm.description()}));
                vm.description("");
            }
        };
    } ;
    return vm
}()) ;

todo.controller = function() {
    todo.vm.init()
} ;


todo.view = function() {
    return m("html", [
        m("body", [
            {tag: "a", attrs: {href: "http://google.com"}, children: "test"},
            {tag: "p", children: [
                {tag: "h1",  children: "h1"},
                {tag: "h2",  children: "h2"},
                {tag: "h3", attrs:{class:"h1-classs" , onclick:"alert('1');" }, children: "h3"}
            ]},
            m("input", {onchange: m.withAttr("value", todo.vm.description), value: todo.vm.description()}),
            m("button", {onclick: todo.vm.add}, "Add"),
            m("table", [
                todo.vm.list.map(function(task, index) {
                    return m("tr", [
                        m("td", [
                            m("input[type=checkbox]", {onclick: m.withAttr("checked", task.done), checked: task.done()})
                        ]),
                        m("td", {style: {textDecoration: task.done() ? "line-through" : "none"}}, task.description())
                    ])
                })
            ])
        ])
    ]);
};

todo.vm.init();
m.mount(document, {controller: todo.controller, view: todo.view});

