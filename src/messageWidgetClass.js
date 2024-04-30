import iframeResizer from "iframe-resizer/js/iframeResizer";

export class MessageWidget {
  endpoint = "https://widget.angoor.ai";
  settings = {};
  defaultStyles = {
    display: "none",
    border: "none",
    position: "fixed",
    zIndex: 9999999,
    bottom: "12px",
    right: "12px",
  };

  constructor(settings) {
    try {
      if (!settings || !settings.id) {
        throw new Error(
          "Cannot initialize MessageWidget: 'id' is required in settings"
        );
      }
      if (typeof document === "undefined") {
        throw new Error(
          "Cannot initialize MessageWidget: document is not defined"
        );
      }
      this.updateSettings(settings);
      const iframe = this.createFrame();
      this.appendFrame(iframe);
      this.setMessageListener(iframe);
    } catch (error) {
      console.error(error.message);
    }
  }

  updateSettings(settings) {
    this.settings = { ...this.settings, ...settings };
  }

  createFrame() {
    const iframe = document.createElement("iframe");
    iframe.src = `${this.endpoint}/${this.settings.id}`;
    iframe.id = "widgetFrame";
    this.setFrameStyles(iframe, this.defaultStyles);
    return iframe;
  }

  appendFrame(iframe) {
    document.body.appendChild(iframe);

    //start-tracking
    iframeResizer({ sizeWidth: "true" }, "#widgetFrame");
  }

  setFrameStyles(iframe, styles) {
    Object.assign(iframe.style, styles);
  }

  setMessageListener(iframe) {
    this.messageListener = (event) => {
      if (event.origin === this.endpoint && event.data.type === "init-data") {
        const { bottom, side } = event.data;
        this.setFrameStyles(iframe, {
          bottom: bottom,
          right: side,
          display: "block",
        });
      }
    };

    window.addEventListener("message", this.messageListener);
  }

  destroy() {
    window.removeEventListener("message", this.messageListener);
    const iframe = document.getElementById("widgetFrame");
    if (iframe) {
      iframe.parentNode.removeChild(iframe);
    }
    this.settings = null;
  }
}
