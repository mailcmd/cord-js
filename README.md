<h1>WORK IN PROGRESS!</h1>

# CORD

CORD is a small experimental reactive javascript library to web development. I am building this
tiny monolitic library just because I **hate** big frameworks full of dependences and a lot of 
externals shits. So I am doing my own reactive mini javascript framework. What I hope? Antthing,
I am doing just for fun. 

### DISCLAMER: 
**I'm building this library just for fun. I started with a simple idea and gradually made it a bit more complex, so this piece of code is a bit messy and should definitely not be used in a real-world setting.**
    
## Concepts

CORD is etentially a javascript client library (CORD-js) that allow to build reactive web pages,
i.e, changing some property of an object, automatically update the page content.

## How to use?

Ways of use containers field inside a template:

```
<local-field>                         # render local field of the current container
$self.<local-field>                   # render local field of the current container
$global.<cord_id>.<local-field>       # render global field of the container <cord_id>
```

# It is better to learn with a tutorial...


## Example 1
Let's start with a simple `index.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>My title</title>
    <style>
      body {
          padding: 0;
          margin: 0;
      }

      .main {
          width: 100vw;
          height: 100vh;
      }

      .main::after {
          content: attr(color);
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-size: 5rem;
      }
    </style>
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
1. We manage a CORD app using the `$CORD` object.
2. `init` is a mandatory function to start to operate with CORD.
3. In `config` const we define some settings and containers. What is a container? It is the main
   unit of CORD. Inside a container you hava access to a local variables (but also you can access
   other containers variables - more about this below).
4. In this example we defined a container named `example` with a local variable `counter`
   initialized in zero.
5. During init, CORD renderize the container content.
6. You can change interactively the value of a local variable using function `update(...)`.

**Some notes**:
CORD always try to render the minimal fragment possible of a container, not the complete container.
Using `update` is not the only way to change variable content, you can do the same with `set`
function (more below).

Let's make some improvement now...

## Example 2
```html
<!DOCTYPE html>
<html>
  <head>
    ...
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
the value. By default it is true. If false it is a lazzy update, i.e., you need to call:
```javascript
$CORD.refresh('example'); // 'example' is the container id
```
to let the changes take effect.

## Example 3
Now, what happen if we want to have many counters? Should we repeat the 2 buttons and the counter
many times? No, in CORD you can use templates:

```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <cord-template cord-tpl-id="tpl-counter">
      <!--
          <div class="counter"
             style="background-color: rgb(${counter * 10}, ${counter * 10}, ${counter * 10});
                    color: contrast-color(rgb(${counter * 10}, ${counter * 10}, ${counter * 10}));"
             color="#${(counter * 10).toString(16).repeat(3)}">
          <button onclick="$CORD.update('%cord-id%', 'counter', ${counter}-1)">Dec -</button>
          ${counter}
          <button onclick="$CORD.update('%cord-id%', 'counter', ${counter}+1)">Inc +</button>
        </div>
      -->
    </cord-template>

    <div class="main">
      <cord-container cord-id="counter1" cord-tpl-ref="tpl-counter"
                      style="display: block; height: 50%;">
      </cord-container>

      <cord-container cord-id="counter2" cord-tpl-ref="tpl-counter"
                      style="display: block; height: 50%;">
      </cord-container>
    </div>

    <script>
     window.addEventListener('cordready', function(e) {
         const config = {
             createGlobals: false,
             strict: false,
             containers: {
                 counter1: {
                     counter: 10
                 },
                 counter2: {
                     counter: 20
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
As you can see, when the template is embeded in the html, you MUST enclose its content in html
comment marks. That's not very elegant but it is needed because CORD need that the browser do not
render the template content before process it. But do not worry, there is a more elegant solution
and soon we will see it.

In this example notice the use of `%cord-id%` macro field. Using it you make sure that every
container that implement this template will reference itself. In fact you can pass more mapped
macro fields using the `cord-map` attribute in `cord-container` tag:

```html
<cord-container cord="example1" cord-tpl-ref="counter"
                cord-map="title:I am example 1|var2:anything">
...
```
Then in your template you can use `%title%` and `%var2%` and wait that the CORD render make the
sustitution.

## Example 4a
Now is time to use template in a more suitable way. Instead of embed the template in the html you
can create independent files and put inside one or more templates without necesity of use comment
marks.

Filename: `counter.ctpl` (the extension is your choise)
```html
<cord-template cord-tpl-id="tpl-counter">
  <div class="counter"
       style="background-color: rgb(${counter * 10}, ${counter * 10}, ${counter * 10});
              color: contrast-color(rgb(${counter * 10}, ${counter * 10}, ${counter * 10}));"
       color="#${(counter * 10).toString(16).repeat(3)}">
    <button onclick="$CORD.update('%cord-id%', 'counter', ${counter}-1)">Dec -</button>
    ${counter}
    <button onclick="$CORD.update('%cord-id%', 'counter', ${counter}+1)">Inc +</
  </div>
</cord-template>
```

Filename: `index.html`
```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <cord-load-templates>
      ./counter.ctpl
    </cord-load-templates>

    <div class="main">
      <cord-container cord-id="counter1" cord-tpl-ref="tpl-counter"
                      style="display: block; height: 50%;">
      </cord-container>

      <cord-container cord-id="counter2" cord-tpl-ref="tpl-counter"
                      style="display: block; height: 50%;">
      </cord-container>
    </div>

    <script>
     window.addEventListener('cordready', function(e) {
         const config = {
             createGlobals: false,
             strict: false,
             containers: {
                 counter1: {
                     counter: 10
                 },
                 counter2: {
                     counter: 20
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

## Example 4b

Special attributes of kind `:<attr>` are useful for boolean type attribute like `disabled` or
`readonly`.

See this example:
```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <div class="main" cord-id="main">
      <button onclick="$CORD.toggle('main:disabled')">Toggle</button>
      <input :disabled="${disabled}" />
    </div>

    <script>
     window.addEventListener('cordready', function(e) {
         const config = {
             createGlobals: false,
             strict: false,
             containers: {
                 counter1: {
                     counter: 10
                 },
                 counter2: {
                     counter: 20
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

You could do the same setting onclick buttun attribute as
`"$CORD.$.main.$disabled=!$CORD.$.main.disabled"`.

But there is a better way to do it...

## Example 4c

Now we will use special attributes `on:<event>` and `bind:<value>`.

See this example:
```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <div class="main" cord-id="main">
      <button on:click="$self.$disabled=!$self.disabled">Toggle</button>
      <input :disabled="${disabled}" on:input="$self.$text=this.value" />
      ${text}
    </div>

    <script>
     window.addEventListener('cordready', function(e) {
         const config = {
             createGlobals: false,
             strict: false,
             containers: {
                 main: {
                     disabled: false,
                     text: ''
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

Notice how inside `on:...` attribute you need to use `$self.` to reference any field of the current
container. Also you could use `$global.` to reference the field of another container.

Now see what happend with special `bind:...` attribute.

```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <div class="main" cord-id="main">
      <label><input type="checkbox" bind:checked="$self.$disabled">Toggle</label>
      <input :disabled="${disabled}" on:input="$self.$text=this.value" />
      ${text}
    </div>

    <script>
     window.addEventListener('cordready', function(e) {
         const config = {
             createGlobals: false,
             strict: false,
             containers: {
                 main: {
                     disabled: false,
                     text: ''
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

Bind allow to link the value of a property to a container field.

## Example 5

Let's go now with `:if` statement.

```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <div class="main" cord-id="main">
      <label><input type="checkbox" bind:checked="$self.$enabled">Enable</label>
      <br/>
      :if enabled :do
        <input on:input="$self.$text=this.value" placeholder="You can write now..."/>
        ${text}
      :else
        You can not write...
      :endif
    </div>

    <script>
     window.addEventListener('cordready', function(e) {
         const config = {
             createGlobals: false,
             strict: false,
             containers: {
                 main: {
                     enabled: false,
                     text: ''
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

Of course, `:else` statement is optional.

## Example 6
Now we will talk about the `:foreach` statement. See this example:
```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <div class="main" cord-id="main">
      <button
        onclick="$CORD.update_object('main', 'tasks',
                 {action: 'push', datas: [
                   {text: 'Dummy task', id: Math.round(Math.random()*1000)}
                 ]})">
        Add new dummy task
      </button>
      <ul>
        :foreach task in tasks :do
        <li>
          ${task_i} ${task}
          <button
            onclick="$CORD.update_object('main', 'tasks', {action: 'remove', datas: [${task_i}]})">
            Remove
          </button>
        </li>
        :endforeach
      </ul>
    </div>

    <script>
     window.addEventListener('cordready', function(e) {
         const config = {
             createGlobals: false,
             strict: false,
             containers: {
                 main: {
                     tasks: []
                 }
             }
         };
         $CORD.init(config);
     });
    </script>
    <script src="../../cord.js"></script>
  </body>
</html>

```

Nothing unusual, just a classic foreach. Now take in account some details:
  1- The item variable (`task` in this case) instance every item of the array.
  2- For every instance exists a variable named `<item>_i` (`task_i` in this case) that store the
     current index.

Also in this example you can see `$CORD.update_object`; more details later.

Now let play a little more with this example. What about you want use `<table>` instead of `<ul>`.
Well, bad news, this cannot be done with an embedded container, you need to use a template for
this. Why? When a container is embebed (no load its content with a template) the browser try to
parse and render its content, and stuff like that will cause problems:

```html
   ...
      <table>
        :foreach task in tasks :do
        <tr>
          <td>
            ${task_i} ${task} <button onclick="...">Remove</button>
          </td>
        </tr>
        :endforeach
      </table>
   ...
```

CORD do not want parse this extract of html because when CORD takes action the browser already
parse/render it and break its struct.

See the solution:

Filename: `tasks.ctpl`
```html
<cord-template cord-tpl-id="tpl-tasks">
  <button
    onclick="$CORD.update_object('%cord-id%', 'tasks',
             {action: 'push', datas: [
               {text: 'Dummy task', id: Math.round(Math.random()*1000)}
             ]})">
    Add new dummy task
  </button>
  <table>
    :foreach task in tasks :do
      <tr>
        <td>
          ${task_i} ${task} <button onclick="...">Remove</button>
        </td>
      </tr>
      :endforeach
  </table>
</cord-template>
```

Filename: `index.html`
```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <cord-container class="main" cord-id="main" cord-tpl-ref="tpl-tasks">
    </cord-container>
    ...
  </body>
</html>

```

## Example 7

Now we go to play a little accesing other containers fields. See this example:

Filename: `tasks.ctpl`
```html
<cord-template cord-tpl-id="tpl-tasks">
  :if $global.main.tasks.length > 0 :do
  <h5>Container showing external values from another container:</h5>
  :endif
  <table border="1">
    :foreach task in $global.main.tasks :do
      <tr>
        <td>
          ${task_i} ${task.text} (${task.id})
        </td>
      </tr>
      :endforeach
  </table>
</cord-template>
```

Filename: `index.html`
```html
<!DOCTYPE html>
<html>
  <head>
    ...
  </head>
  <body>
    <cord-load-templates>
      ./tasks.ctpl
    </cord-load-templates>
    <table width="100%">
      <tr valign="top">
        <td width="50%">
          <div class="main" cord-id="main">
            <button
              on:click="$self.add({text: 'Dummy task', id: $self.$id++})">
              Add new dummy task
            </button>
            <ul>
              :foreach task in tasks :do
              <li>
                ${task_i}: ${task.text} (${task.id})
                <button on:click="$self.remove(${task_i})">
                  Remove
                </button>
              </li>
              :endforeach
            </ul>
            <cord-script>
              $self.add = function(v) {
                $self.$tasks = $self.$tasks.concat([v]);
              }
              $self.remove = function(i) {
                $self.tasks.remove(i);
                $self.$tasks = $self.tasks;
              }
            </cord-script>
          </div>
        </td>
        <td>
          <cord-container cord-id="main2" cord-tpl-ref="tpl-tasks">
          </cord-container>
        </td>
      </tr>
    </table>

    <cord-container cord-id="other" cord-tpl-ref="tpl-tasks">
    </cord-container>

    <script>
     window.addEventListener('cordready', function(e) {
         const config = {
             createGlobals: false,
             strict: false,
             containers: {
                 main: {
                     tasks: []
                 },
                 main2: {
                 }
             }
         };
         $CORD.init(config);
     });
    </script>
    <script src="../../cord.js"></script>
  </body>
</html>

```

Notice how we add function to container with `<cord-script>` tag and using `$self.<fun> = function(...){...}`. 

## Example 8

Accesing fields in the bad and ugly way.
$CORD.$...

## Example 9
Loading templates: with tags or as args passed to new CORD(...).
Also dynamic load.

## Example 10
Dynamic containers creation...

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
   - [x] foreach and if parser while loop make security exit (max nested depth)
   - [x] If inside foreach
   - [x] Attributes type 'disabled' or 'checked'
   - [x] <cord-script> tag, work on local functions and vars. Also try containers vars as local var.
   - [x] Inside a container, not needed to use $CORD.$.<cont_id>.<prop> to modify, just <prop>.
   - [x] 'get_indentifier' function is a piece of SHIT, I need to remake this function from zero.
   - [x] Throw error when cord_id does not match [a-zA-Z0-9\_].
   - [x] bind:... special attr. Useful to join element property with a local var.
   - [ ] ~~Hide noscript and if/foreach templates.~~
   - [ ] 'get_indentifier' function lexer still is not good enough, it need to be more accurate.
   - [ ] Think in a way to pass a list of templates to load previous to bootstrap
   - [ ] cord-style tag to load css and create superclasses.


## WEBSOCKET and EVENTSOURCE
   - [x] Define format for direct server update of cord_containers

