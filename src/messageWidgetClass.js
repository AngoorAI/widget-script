import iframeResizer from "iframe-resizer/js/iframeResizer";

export class MessageWidget {
  endpoint = "https://widget.angoor.ai";
  // iframeOrigin = null;
  settings = {};
  defaultStyles = {
    display: "none",
    border: "none",
    position: "fixed",
    zIndex: 9999999,
    bottom: "0px",
    right: "0px",
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

  sendViewportSize(iframe) {
    if (iframe.contentWindow) {
      const height = window.innerHeight;
      const width = window.innerWidth;
      
      iframe.contentWindow.postMessage({
        type: "viewport-size",
        height: height,
        width: width
      }, "*");
      iframe.contentWindow.postMessage({
        type: "parent-init",
        hostUrl: window.location.href
      }, "*");
    }
  }
  
  

  appendFrame(iframe) {
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      try {
        iframeResizer({ 
          sizeWidth: true,
          sizeHeight: true,
        }, "#widgetFrame");
      } catch (error) {
      }
    };
    setTimeout(() => {
      this.sendViewportSize(iframe);
    }, 100);
  }

  setFrameStyles(iframe, styles) {
    Object.assign(iframe.style, styles);
  }

  setMessageListener(iframe) {
    this.messageListener = (event) => {
      
      if (event.data.type === "init-data") {
        this.setFrameStyles(iframe, {
          display: "block",
        });
        this.sendViewportSize(iframe);
      }
      if (event.data.type === "iframe-ready") {
        this.sendViewportSize(iframe);
      }
    };
  
    const handleResize = () => {
      this.sendViewportSize(iframe);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener("message", this.messageListener);
    this.resizeHandler = handleResize;
  }

  destroy() {
    window.removeEventListener("message", this.messageListener);
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    const iframe = document.getElementById("widgetFrame");
    if (iframe) {
      iframe.parentNode.removeChild(iframe);
    }
    this.settings = null;
  }
}
