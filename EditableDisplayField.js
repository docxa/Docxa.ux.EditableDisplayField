Ext.ns('Docxa.ux');

Docxa.ux.EditableDisplayField = Ext.extend(Ext.form.DisplayField, {
    onRender : function(){
        Docxa.ux.EditableDisplayField.superclass.onRender.apply(this, arguments);
        this.displayEl = this.el.createChild({
            tag   : 'span'
        });
        this.editEl = this.el.createChild(this.editConfig || {
            tag   : 'a',
            href  : '#',
            html  : 'edit',
            style : 'margin-left: 4px;'
        });
        
        this.editEl.on('click', this.startEditing, this, {
            stopEvent : true
        });
    },
    getRawValue : function(){
        var v = this.rendered ? this.displayEl.dom.innerHTML : Ext.value(this.value, '');
        if(v === this.emptyText){
            v = '';
        }
        if(this.htmlEncode){
            v = Ext.util.Format.htmlDecode(v);
        }
        return v;
    },
    setRawValue : function(v){
        if(this.htmlEncode){
            v = Ext.util.Format.htmlEncode(v);
        }
        return this.rendered ? (this.displayEl.dom.innerHTML = (Ext.isEmpty(v) ?  (this.emptyText || '') : v)) : (this.value = v);
    },
    startEditing : function(){
        var ed = this.getEditor();
        var v  = this.getValue();
        this.editing = true;
        ed.startEdit(this.el, Ext.isDefined(v) ? v : '');
    },
    stopEditing : function(cancel){
        if(this.editing){
            var ed = this.getEditor();
            ed[cancel === true ? 'cancelEdit' : 'completeEdit']();
        }
        this.editing = false;
    },
    getEditor : function(){
        if(!this.editor){
            this.editor = new Ext.Editor({
                field     : new Ext.form.TextField(),
                alignment : 'tl-tl',
                autoSize  : 'width'
            });
            this.editor.on({
                scope      : this,
                complete   : this.onEditComplete,
                canceledit : function(){
                    this.stopEditing(true);
                }
            });
        }
        return this.editor;
    },
    onEditComplete : function(ed, value, startValue){
        this.editing = false;
        if(value !== startValue){
            this.setValue(value);
            this.fireEvent('change', this, value, startValue);
        }
    }
});

Ext.reg('editable-displayfield', Docxa.ux.EditableDisplayField);
