# Main Vars
- elem.cordGlobalFields: 
Store global fields referenced inside a container. It is created and populated by 
`process_containers` function and used for `render_container` function. 

- elem.cordNodes:
Store container text nodes asosiating each one to every field referenced inside it. 
`elem.cordNodes = { field1: Set(node1, node2, node3, ...), field2: Set(...) }`

- elem.cordForeach:
Store container `foreach` templalates asosiating each one to every field referenced in `foreach_key`
and inside it. 
`elem.cordForeach = { field1: Array(tpl1, tpl2, tpl3, ...), field2: Array(...) }`

- elem.cordIfs:
Store container `if` templalates asosiating each one to the fields referenced its expression.
and inside it. 
`elem.cordIfs = { field1: Array(tpl1, tpl2, tpl3, ...), field2: Array(...) }`

- elem.cordAttrs:
Store a collection of attributes inside a container that reference any field. 
`elem.cordAttrs = [ {node: >element>, name: <attr_name>, eval: <attr_eval_expression>}, ... ]`

- window.cordGlobalNodes, window.cordGlobalForeachs, window.cordGlobalIfs:
Store reference of global fields to nodes inside any container. 
```
window.cordXXX = { 
  <cord_id>: { 
    <field>: Set(node1, node2, ...), 
    ... 
  }, 
  ... 
}
```

- window.cordGlobalAttrs:
Store reference of global fields to element attributes inside any container (same as elem.cordAttrs)
