const config = {
    createGlobals: false,
    strict: true,
    containers: {
        menu: {
            root: []
        },
        test: {
            counter: 0
        }
    }
};

window.addEventListener('cordready', async function(e) {
    config.containers.menu.root =  JSON.parse(await $CORD.fetch('menu.json'));
    $CORD.init(config);
});
