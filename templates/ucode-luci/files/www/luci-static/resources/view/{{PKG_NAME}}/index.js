'use strict';
'require view';
'require form';

return view.extend({
    render: function() {
        var m = new form.Map('{{PKG_NAME}}', _('{{PKG_NAME}}'), _('Configure the {{PKG_NAME}} settings.'));
        var s = m.section(form.NamedSection, 'main', 'settings');
        var o = s.option(form.Value, 'name', _('Name'));
        o.default = 'World';
        o.rmempty = false;
        return m.render();
    }
});
