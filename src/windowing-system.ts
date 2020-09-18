import Utils from "./module/Utils";

Hooks.once('init', async function() {
	Utils.debug('Module initialized.', false);
});


Hooks.once('setup', function() {
	Utils.debug('Setup complete.', false);
});


Hooks.once('ready', function() {
	Utils.debug('Ready.', false);
});
