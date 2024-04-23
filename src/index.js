import { MessageWidget } from "./messageWidgetClass";

function initMessageWidget(settings) {
  const messageWidget = new MessageWidget(settings);

  if (typeof window !== "undefined") {
    if (window.MessageWidgetInstance) {
      window.MessageWidgetInstance.destroy();
    }
    window.MessageWidgetInstance = messageWidget;
  } else {
    console.error(
      "Cannot attach MessageWidget instance to window: window is not defined"
    );
  }
}

export { initMessageWidget };
