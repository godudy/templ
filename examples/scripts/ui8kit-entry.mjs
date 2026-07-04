import {
  getNamespace,
  registerPattern,
  dialog,
  tabs,
  combobox,
  menu,
  menubutton,
  alertPattern,
} from "@ui8kit/aria";

registerPattern(dialog);
registerPattern(tabs);
registerPattern(combobox);
registerPattern(menu);
registerPattern(menubutton);
registerPattern(alertPattern);
getNamespace().init();
