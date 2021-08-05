import {
  App,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  addIcon,
  FileSystemAdapter,
} from "obsidian";

addIcon(
  "arrowhead-link",
  `<path fill="currentColor" stroke="currentColor" d="M57.933 69.923a1.043 1.043 0 00-1.458 0L41.453 84.955c-6.961 6.952-18.701 7.695-26.377 0-7.694-7.694-6.96-19.425 0-26.376L30.1 43.547a1.043 1.043 0 000-1.458l-5.146-5.146a1.055 1.055 0 00-1.467 0L8.463 51.965c-10.939 10.94-10.939 28.646 0 39.565 10.939 10.929 28.645 10.939 39.565 0L63.06 76.507a1.043 1.043 0 000-1.457l-5.127-5.127zM91.377 8.636c-10.939-10.939-28.646-10.939-39.565 0L36.77 23.658a1.055 1.055 0 000 1.468l5.136 5.136a1.043 1.043 0 001.458 0L58.387 15.23c6.96-6.952 18.7-7.695 26.376 0 7.695 7.694 6.961 19.425 0 26.376L69.741 56.638a1.043 1.043 0 000 1.458l5.146 5.146a1.026 1.026 0 001.457 0l15.033-15.023c10.919-10.938 10.919-28.645 0-39.583zM62.606 32.029a1.043 1.043 0 00-1.458 0L31.856 61.3a1.043 1.043 0 000 1.458l5.117 5.127a1.055 1.055 0 001.467 0l29.273-29.273a1.055 1.055 0 000-1.467l-5.107-5.117z" fill-rule="nonzero"/>`
);

interface ArrowheadSettings {
  linkBase: string;
}

const DEFAULT_SETTINGS: ArrowheadSettings = {
  linkBase: "some.notes.link",
};

export default class Arrowhead extends Plugin {
  settings: ArrowheadSettings;

  async onload() {
    await this.loadSettings();

    this.addRibbonIcon("arrowhead-link", ">> Copy Link", () => {
      const activeFile = this.app.workspace.getActiveFile();
      if (!activeFile) {
        new Notice("No file opened!");
        return;
      }
      const link = encodeURI(
        `${this.settings.linkBase}${activeFile.path.replace(".md", "")}`
      );
      navigator.clipboard.writeText(link).then(
        () => {
          new Notice("Link copied!");
        },
        () => {
          new Notice("Couldn't copy...");
        }
      );
    });

    this.addStatusBarItem().setText("Status Bar Text");

    this.addSettingTab(new ArrowHeadSettingsTab(this.app, this));
  }

  onunload() {
    console.log("unloading plugin");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    console.log(this.settings);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class ArrowHeadSettingsTab extends PluginSettingTab {
  plugin: Arrowhead;

  constructor(app: App, plugin: Arrowhead) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Arrowhead Settings" });

    new Setting(containerEl)
      .setName("Link Base")
      .setDesc("Note paths are URI encoded and appended to this string")
      .addText((text) =>
        text
          .setPlaceholder("Enter a link base...")
          .setValue(this.plugin.settings.linkBase)
          .onChange(async (value) => {
            this.plugin.settings.linkBase = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
