<h1>WORK IN PROGRESS, NOT USABLE YET!</h1>

# TODO

## CORD-js
   - [x] Why templates? Can I just use directly the element? It seems that not :(
   - [x] I need an evaluator, it is not enough just replace field name.
   - [x] Check if there is changes, if not do nothing (if change only attrs no update inside).
   - [x] Open websocket to enable server side change container (SSCC)
   - [x] Dynamic fetch and add templates/html from server
   - [x] EventSource support (work as websocket but no channels)
   - [x] What happend with containers inside containers?
   - [x] Foreach: add index (i variable)
   - [x] Add :if/:else statement
   - [x] Improve foreach parser to allow nested statements
   - [x] Improve if/else parser to allow nested statements
   - [x] Create a custom element cord-template to create noscript templates
   - [x] Create a custom element cord-container to invoke a cord-template 
   - [ ] cord-style tag to load css and create superclasses.
   - [x] foreach and if parser while loop make security exit (max nested depth)
   - [x] If inside foreach 
   - [x] Attributes type 'disabled' or 'checked'
   - [ ] Special attribute 'render-onchange' to force render on field change 
   

## WEBSOCKET and EVENTSOURCE
   - [x] Define format for direct server update of cord_containers
   

# CORD

CORD a small reactive javascript library to web development 

## Concepts

CORD is etentially a javascript client library (CORD-js) that allow to build reactive web pages, 
i.e, changing some property of an object, automatically update the page content. 

## How to use?

Ways of use containers field inside a template:

```
${<local-field>}                         # render local field of the container
#{<cord-id>:<field>}                     # way of use foreing field
```

# Tutorial


## Example 1
Let's start with a simple `index.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>My title</title>
  </head>
  <body>
    <div cord-id="example">
      <div style="background-color: rgb(${counter * 10}, ${counter * 10}, ${counter * 10});
                  color: contrast-color(rgb(${counter * 10}, ${counter * 10}, ${counter * 10}));">
        <button onclick="$CORD.update('example', 'counter', ${counter}-1)">Dec -</button>
        ${counter}
        <button onclick="$CORD.update('example', 'counter', ${counter}+1)">Inc +</button>
      </div>
    </div>
    <script>
     window.addEventListener('cordready', function(e) {
         const config = {
             createGlobals: false,
             strict: false,
             containers: {
                 example: {
                     counter: 0
                 }
             }
         };
         $CORD.init(config);
     });
    </script>
    <script src="cord.js"></script>
  </body>
</html>

```

What happen here? CORD did the bootstrap process and then dispach `cordready` event. Inside the 
event we call `$CORD.init(...)` function. What do you learn from this? 
1- We manage a CORD app using the `$CORD` object. 
2- `init` is a mandatory function to start to operate with $CORD.
3- In `config` const we define some settings and containers. What is a container? It is the main
   unit of CORD. Inside a container you hava access to a local variables (but also you can access
   other containers variables - more about this below).
4- In this example we defined a container named `example` with a local variable `counter` 
   initialized in zero. 
5- During init CORD renderize the container content.
6- You can change interactively the value of a local variable using function `update(...)`.

**Some notes**:
CORD always try to render the minimal fragment possible of a container, not the complete container.
Using `update` is not the only way to change variable content, you can do the same with `set` 
function (more below).

Let's make some improvment now...

## Example 2
```html
<!DOCTYPE html>
<html>
  <head>
    <title>My title</title>
  </head>
  <body>
    <div cord-id="example">
      <div style="background-color: rgb(${counter * 10}, ${counter * 10}, ${counter * 10});
                  color: contrast-color(rgb(${counter * 10}, ${counter * 10}, ${counter * 10}));">
        <button onclick="$CORD.set('example:counter', ${counter}-1)">Dec -</button>
        ${counter}
        <button onclick="$CORD.set('example:counter', ${counter}+1)">Inc +</button>
      </div>
    </div>
    <script>
    ...
    </script>
    <script src="cord.js"></script>
  </body>
</html>

```
What changed? Now we used `set` instead of `update`. The function `update` is more useful when you
need to update many variables in one step. For example, if the container `example` were this: 

```json
...
containers: {
    example: {
        counter: 0,
        color: 'red'
    }
}
...
```
you could call `update` in this way:
```javascript
$CORD.update('example', {counter: 10, color: 'blue});
```

`set` function is useful for atomic changes. The way you reference a variable is with a kind of 
hierarchical string domain: `"<container_name>:<local_varname>"`. But this is more useful yet! 
If you have:
```json
...
containers: {
    example: {
        counters: [{c: 0}, {c: 99}]
    }
}
...
```
you could do this:
```javascript
$CORD.set('example:counters:0:c', 1000);
```

Of course you also count with `get` function:
```javascript
$CORD.get('example:counters:0:c'); // return: 1000 
$CORD.get('example:counters:1:c'); // return: 99
```

The `set` function count with a third parameters that allow to instruct CORD to render after set
the value. By default it is true. 

## Example 3
Now, what happen if we want to have many counters? Should we repeat the 2 buttons and the counter 
many times? No, in CORD you can use templates:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My title</title>
  </head>
  <body>
    <cord-template cord-tpl-id="tpl-counter">
      <div>
        <div style="background-color: rgb(${counter * 10}, ${counter * 10}, ${counter * 10});
                    color: contrast-color(rgb(${counter * 10}, ${counter * 10}, ${counter * 10}));">
          <button onclick="$CORD.update('%cord-id%', 'counter', ${counter}-1)">Dec -</button>
          ${counter}
          <button onclick="$CORD.update('%cord-id%', 'counter', ${counter}+1)">Inc +</button>
        </div>
      </div>
    </cord-template>
    
    <cord-container cord-id="example1" cord-tpl-ref="counter">
    </cord-container>
    
    <cord-container cord-id="example2" cord-tpl-ref="counter">
    </cord-container>

    <script>
     window.addEventListener('cordready', function(e) {
         const config = {
             createGlobals: false,
             strict: false,
             containers: {
                 example1: {
                     counter: 10
                 },
                 example2: {
                     counter: 20
                 },
             }
         };
         $CORD.init(config);
     });
    </script>
    <script src="cord.js"></script>
  </body>
</html>

```

Notice the use of `%cord-id%` map field. Using it you make sure that every container that 
implement this template will reference itself. In fact you can pass more mapped fields using the
`cord-map` attribute in `cord-container` tag:

```html
<cord-container cord="example1" cord-tpl-ref="counter" cord-map="title:I am example 1|var2:anything">
...
```
Then in your template you can use `%title%` and `%var2%` and wait that the render make the 
sustitution. 

## Example 4

Special attributes :<attr> 

## Example 5

:if 

## Example 6

:foreach


## The CORD API 
### `$CORD.init(config)`
The config is in the form: 

```js
const config = {
    createGlobals: true,                          // create a global variable for every container
    strict: true,                                 // if true return undefined when you reference 
                                                  // container field that does not exists, if false
                                                  // return an empty string.
                                                  
    websocket: {                                  // If defined set the way to connecto to websocket
        url: 'ws://localhost:8080/websocket',     // server. With reconnect in true the ws will do
        reconnect: true,                          // the best effort to keep the connection open.
        reconnect_delay: 1000,
        onmessage: <function_name>                // Generic message receiver. CORD intercept msg
                                                  // and verify if action is 'cord-update' or 
                                                  // 'cord-update-object' to attend CORD updates.
                                                  // If not, call this 'onmessage' function with 
                                                  // the message as parameter. 
                                                  // When you use $CORD.ws.send(msg, ...), if you 
                                                  // set in the msg 'msg_id' parameter and set in 
                                                  // second parameter a callback, the interception 
                                                  // of CORD is disabled for messages that arrive
                                                  // with the same 'msg_id'.
                                                  
    },
    eventsource: {                                // Same as websocket but with one direction 
        url: 'http://localhost:8080/eventsource', // service backed by EventSource.
        reconnect: true,
        reconnect_delay: 1000,
        onmessage: <function_name>                // Generic message receiver. CORD intercept msg
                                                  // and verify if action is 'cord-update' or 
                                                  // 'cord-update-object' to attend CORD updates.
                                                  // If not, call this 'onmessage' function with 
                                                  // the message as parameter. 
    },
    containers: {                                 // Set initials values for the fields inside
        'tasks-list': {                           // every cord-id defined container. 
            tasks: [ 
                {desc: "task 1"} 
            ]
        },
        counter: {
            value: 0
        }
    }
};

// 'cordready' event is dispached when finalize CORD bootstrap process
window.addEventListener('cordready', e => {
    $CORD.init(config);
});

```

### $CORD.update(<cord-id>, <field>, <value>)
### $CORD.update(<cord-id>, <fields_datas>)

`update` allow update fields values inside a container. You can use it in 2 ways: 

```js
$CORD.update('counter', 'value', 1000);
// or 
$CORD.update('tasks-list', {tasks: [ {desc: 'task 1'}, {desc: 'task 2'} ]});
```

### $CORD.update_object(<cord-id>, <field>, <operation>)
This is a more sofisticate way to update fields value. Ex: if you do not want to rewrite all the 
tasks with a new array and you only pretend to add a new task, you can do:

```js
$CORD.update_object('tasks-list', 'tasks', {action: 'push', datas: [{desc: 'task 3'}] });
// or to remove the last pushed:
$CORD.update_object('tasks-list', 'tasks', {action: 'pop', datas: [] });
```

Actually what this function do is call for the field `tasks` (that is an Array) the function 
`action` with params `...datas`:

```js
$CORD.update_object('tasks-list', 'tasks', {action: 'pop', datas: [] });
// is like 
<container-tasks-list>.tasks.pop(...[])

// You could also call:
$CORD.update_object('tasks-list', 'tasks', {action: 'splice', datas: [2,1] });
// that will be like call
<container-tasks-list>.tasks.splice(...[2, 1])
```

### $CORD.refresh(<cord-id>)
Well, not much to explain, just refresh (re-render) all fields of each container. 

`################################################################################################`



**Missing DOC** 
- $CORD.$... 
- Websocket bidirectional communication and containers updates
- EventSource server events to update containers

  ## Some details to remember
    - $CORD.$.<cord-id>
      It is a reference to the container

    - $CORD.$.<cord-id>.<field_name>
      It is a reference to the field; it can be update but the refresh of the container will not
      happen until '$CORD.update(<cord-id>)' be called. So it is an 'update delayed'.

    - $CORD.$.<cord-id>.$<field_name>
      It is a reference to the field; it can be update and the refresh of the container will
      happen instantly. So it is an 'instant update'.

    - $CORD.set('<cord-id>:<field>', <value>) 
    - $CORD.get('<cord-id>:<field>') 


`################################################################################################`


## Installation

