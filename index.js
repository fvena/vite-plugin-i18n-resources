const { readdirSync, readFileSync} = require("fs");

/**
 * Returns an array with all file paths within a directory filtered by file type
 *
 * @param {String} path - Files path
 * @param {String} type - Files type
 * @return {Array} - Array with the files paths
 */
function getFiles(path = "./", type = "json") {
  const entries = readdirSync(path, { withFileTypes: true });

  //
  // Get files within the current directory and returns an array with the files paths
  //
  const files = entries
    .filter(file => !file.isDirectory() && file.name.split('.').pop() === type)
    .map(file => `${path}/${file.name}`);

  //
  // Get folders within the current directory
  //
  const folders = entries.filter(folder => folder.isDirectory());

  //
  // Add the found files within the subdirectory to the files array
  // by calling the current function itself
  //
  for (const folder of folders) {
    files.push(...getFiles(`${path}/${folder.name}`));
  }

  return files;
}

/**
 * Finds all translation message files within the specified path
 * and generates an object with all translations compatible with i18n
 *
 * @param {String} path - Files path
 * @return {Object} - Messages
 */
function getMessages(path = "./") {
  const files = getFiles(path);

  const result = files.reduce((messages, file) => {
      const matched = file.match(/(.+\/)*(.+)\.(.+)\.json/i);

      if (matched && matched.length > 1) {
        const lang = matched[3];
        const section = matched[2];

        if (!messages[lang]) {
          messages[lang] = {};
        }

        const data = readFileSync(file);

        messages[lang][section] = JSON.parse(data);
      }

      return messages;
    }, {})

  return result;
}

/**
 * Plugin
 * Serving a Virtual File with all translations
 */
const viteI18nResources = (options = {}) => {
  const virtualFileId = 'vite-i18n-resources';
  const { path } = options;
  let messages = getMessages(path);

  return {
    name: 'vite-plugin-i18n-resources',
    resolveId(id) {
      if (id === virtualFileId) {
        return virtualFileId
      }
    },

    load(id) {
      if (id === virtualFileId) {
        return `export const messages = ${JSON.stringify(messages)}`;
      }
    },

    //
    // Watch translation message files,
    // and emit a custom event with the updated messages
    //
    handleHotUpdate({file, server}) {
      if (!file.includes(path) || file.split('.').pop() !== 'json') return;

      const matched = file.match(/(.+\/)*(.+)\.(.+)\.json/i);

      if (matched && matched.length > 1) {
        messages = getMessages(path);

        server.ws.send({
          type: 'custom',
          event: 'locales-update',
          data: messages
        })
      }
    }
  }
}

export default viteI18nResources;
