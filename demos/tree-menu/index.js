const config = {
    createGlobals: false,
    strict: true,
    containers: {
        menu: {
            root: []
        }
    }
};

window.addEventListener('cordready', async function(e) {
    config.containers.menu.root =  JSON.parse(await $CORD.fetch('menu.json'));
    $CORD.init(config);
});
