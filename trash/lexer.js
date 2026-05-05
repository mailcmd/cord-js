/*
  Container example:
  main: {
    counter: 0,
    list: [
      {a: 1, b: 2},
      {a: 10, b: 20},
      {a: 100, b: 200},
      {a: 1000, b: 2000}
    ],
    grid: {
      row1: {col1: 1, col2: 2, col3: 3},
      row2: {col1: 10, col2: 20, col3: 30},
      'row-3': {col1: 10, col2: 20, col3: 30},
    }
  }

  Locals:

  - counter                          -> counter
    $self.counter                    -> counter
  - list[0].a                        -> list
    $self.list[0].a                  -> list
  - grid.row2.col3                   -> grid
    $self.grid.row2.col3             -> grid
  - grid['row-3'].col2               -> grid
    $self.grid['row-3'].col2         -> grid

  Globals:

  - #main:counter                    -> #main:counter
    $.main.counter                   -> #main:counter
    $global.main.counter             -> #main:counter
  - #main:list:0:a                   -> #main:list
    $.main.list[0].a                 -> #main:list
    $global.main.list[0].a           -> #main:list
  - #main:grid:row2:col3             -> #main:grid
    $.main.grid.row2.col3            -> #main:grid
    $global.main.grid.row2.col3      -> #main:grid
  - #main:grid:row-3:col2            -> #main:grid
    $.main.grid['row-3'].col2        -> #main:grid
    $global.main.grid['row-3'].col2  -> #main:grid

*/

function get_curated_identifiers(list) {
    return list.map(identifier => {
        identifier = identifier
            .replace('$global.', '#')
            .replace(/^\$\./, '#')
            .replace(/#\{(.+?)\}/g, '#$1')
            .replace('$self.', '')
            .replace(/\[['"](.+?)['"]\]/g, '.$1');

        if (identifier[0] == '#') {
            const [p1, p2] = identifier.replace(/[#\$]/g, '').split(/[\.\:]/);
            return '#' + p1 + ':' + p2;
        } else {
            return identifier.replace(/\$/g, '').split('.')[0];
        }            
    });
}

function lexer(str) {
    const separators = [';', ',', '+', '-', '*', '/', '%', ')', '|', '&', '%'];
    let i = 0, current_lexema = '', string_opener = '';
    const lexemas = [];

    str = str.replace(/ /g, '');

    while (i < str.length) {
        // end of identifier, save it
        if (string_opener == '' && separators.includes(str[i])) {
            if (current_lexema.length > 0) {
                lexemas.push(current_lexema);
                current_lexema = '';
            }
            
        // end of identifier but is a function, do not save it
        } else if (string_opener == '' && str[i] == '(') {
            if (current_lexema.length > 0) {
                current_lexema = '';
            }
            
        // open a string
        } else if (string_opener == '' && ['"', "'"].includes(str[i])) {
            if (current_lexema.length > 0) {
                console.warn('Unexpected start of string:', str, '(position: '+i+')')
            } else {
                string_opener = str[i];
            }
            current_lexema = '';
            
        // end of "..." string
        } else if (string_opener == '"' && str[i] == '"') {
            string_opener = '';
            current_lexema = '';
            
        // end of '...' string
        } else if (string_opener == "'" && str[i] == "'") {
            string_opener = '';
            current_lexema = '';
            
        // start of identifier
        } else if (current_lexema.length == 0 && str[i].match(/[a-zA-Z\_\$\#]/)) {
            current_lexema += str[i];

        // rest of the identifier
        } else if (current_lexema.length > 0) {
            current_lexema += str[i];
        }
        
        i++;
    }
    if (current_lexema.length > 0) lexemas.push(current_lexema);
    
    return lexemas;
}

