// const cord_eval = function(str, context)  {
//     const sandbox = new Proxy(context, {
//         get(target, prop) {
//             if (prop in target) {
//                 return target[prop];
//             } else if (prop in window) {
//                 return window[prop];
//             } else {
//                 return $this.config.strict ? undefined : "";
//             }
//         },
//         has(target, prop) {
//             return true;
//         }
//     });

//     const replaces = str.matchAll(/#\{(.+?)\}/gs)
//         .toArray()
//         .map(([t, e]) => [t, '$[\''+e.replace(/:/g, '\'][\'')+'\']'])

//     str = replaces.reduce((s, [m, n]) => s.replace(new RegExp(m, 'g'), n), str);

//     const _sandbox = Object.fromEntries(
//         Object.entries(sandbox).filter( ([k,_]) => k[0] != '#')
//     );
//     const keys = Object.keys(_sandbox);
//     const values = Object.values(_sandbox);
//     const str_decoded = decode_htmlentities(str);

//     const evaluator = new Function(...keys,
//         // `with (this) { return \`${str_decoded}\`; }`
//         `with (this) { return ${str_decoded}; }`
//     );

//     try {
//         // return evaluator.bind(window).apply(sandbox, values);
//         return evaluator.bind(sandbox).apply(sandbox, values);
//     } catch(e) {
//         console.error(`Error evaluating string: `, e);
//         return str;
//     }
// };


// const tokenizer = function(str, cord_id) {
//     let i = 0, token = '', string_opened = false;
//     const tokens = [];
//     while (str[i] !== undefined) {
//         const c = str[i];
//         if (!string_opened && c.match(/[a-z0-9_\$\:\#]/)) {
//             token += c;
//         } else if (!string_opened && c == '.') {
//             if (token != '') {
//                 tokens.push(token.trim());
//                 token = '';
//             }
//         } else if (!string_opened && ['[', ']'].includes(c)) {
//             if (token != '') {
//                 tokens.push(token.trim());
//                 token = '';
//             }
//         } else if (!string_opened && ['(', ')'].includes(c)) {
//             if (token != '') {
//                 tokens.push(token.trim());
//                 token = '';
//             }
//         } else if (!string_opened && [',', ';', '|', '&'].includes(c)) {
//             if (token != '') {
//                 tokens.push(token.trim());
//                 token = '';
//             }
//         } else if (!string_opened && ["'", '"'].includes(c)) {
//             if (token != '') {
//                 tokens.push(token.trim());
//                 token = '';
//             }
//             string_opened = true;
//         } else if (string_opened && ["'", '"'].includes(c)) {
//             string_opened = false;
//         } 
//         i++;
//     }
//     if (token != '') tokens.push(token.trim());

//     return tokens;

//     // :'( I can do this below because get_indetifier is used during bootstrap process and
//     //     during bootstrap the containers are not initialized.
//     //     I need to think about this, maybe remake some CORD parts. 

//     // const containers_keys = Object.fromEntries(
//     //     Object.keys(DATAS).map( k => {return [k, Object.keys(DATAS[k])] })
//     // );
//     // const valid_tokens = [];
//     // if (tokens.length == 1 && containers_keys[cord_id].includes(tokens[0])) {
//     //     valid_tokens.push(tokens[0]);
//     // } else if (containers_keys[tokens[0]]?.includes(tokens[1])) {
//     //     valid_tokens.push(tokens[1]);
//     // }
//     // return valid_tokens.length > 0 ? valid_tokens : null;
// };

// const get_identifiers = function(str, cord_id) {
//     str = decode_htmlentities(str);
//     const discard_list = ['_', null, '$'];

//     const result = str
//           .matchAll(/\$\{(.+?)\}/gs)
//           .toArray()
//           .map(([_, e]) => tokenizer(e, cord_id))
//           .flat(Infinity);

//     // console.log('IDS', result, cord_id)

//     return result     
//         .uniq()
//         .map(s => s.trim())
//         .filter(v => !(discard_list.includes(v)));
// };    


    // const get_identifiers = function(str, cord_id) {
    //     str = '\`'+decode_htmlentities(str)+'\`';
    //     const result = [], discard_list = ['_'];

    //     // convert #{container:field} -> #container:field
    //     result.push(
    //         ...(str
    //             .matchAll(/#\{(.+?)\}/gs)
    //             .toArray()
    //             .map(([_, e]) => '#'+e))
    //     );
    //     str = str.replace(/#\{(.+?)\}/gs, '_');

    //     _str = str
    //         .matchAll(/\$\{(.+?)\}/gs)
    //         .toArray()
    //         .map(([_, e]) => e);

    //     // console.log('STR', _str);
    //     const local_handler = {
    //         get(target, prop, x) {
    //             if (typeof prop == 'symbol') return (x)=>0;
    //             if (typeof prop == 'string') result.push(prop);
    //             if (target.xref && !target.$) {
    //                 return ()=>0;
    //             } else {
    //                 return new Proxy({xref: target, $: prop=='$'?true:false}, local_handler);
    //             }
    //         },
    //         has(target, prop) {
    //             return true;
    //         }
    //     };
    //     sandbox =  new Proxy({eval: window.eval}, local_handler);
    //     const evaluator = new Function(
    //      `with (this) { return ${str}; }`
    //     );
    //     evaluator.bind(sandbox)();

    //     return result
    //         .uniq()
    //         .map(s => s.trim())
    //         .filter(v => !(discard_list.includes(v)));
    // };



/* garbage:
            // try {
            //     tmp = window.eval(`
            //     (function(){
            //     const v = new Proxy({}, {
            //         has(target, prop) { return true; },
            //         get(target, prop) { return target[prop]; }
            //     })
            //     with(v) {
            //         ${js};
            //     }
            //     return Object.assign({}, v);
            //     })()
            //     `);
            //     DATAS[cord_id] = {...tmp, ...DATAS[cord_id]};
            // } catch(e){
            //     console.log('Error in cord-script tag content: ', e);
            // }
*/

