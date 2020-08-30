const run = async () => {
  const plugin = new OverwolfPlugin('experimental-plugin');
  
  try {
    await plugin.initialize();
    console.log('Plugin initialized');
    
    console.log(`isHAGSEnabled = ${plugin.instance.isHAGSEnabled}`);
    
    // We expose it globally for debugging convenience
    window.plugin = plugin;
  } catch (e) {
    console.error('Failed to create plugin: ', e);
  }
}

run();
