/*
 * myoj - Make Your Own jQuery
 *
 * A minimal jQuery 1.0 reimplementation, built lesson by lesson
 * to study how the original selector engine, DOM manipulation,
 * and event system work under the hood.
 *
 * Reference: jQuery 1.0 by John Resig (jquery.com), MIT licensed.
 * See /LICENSE and /reference/jquery-1.0.js.
 *
 * Author: GrntKim
 */

function myoj(selector, context) {
    if ( selector && typeof selector === 'function' && myoj.fn.ready ) 
        return myoj(document).ready(selector);

    selector = selector || myoj.context || document;

    if ( window === this ) return new myoj(selector, context);

    this.get( Array.isArray(selector) || selector.length && !selector.nodeType && selector[0] != undefined && selector[0].nodeType ? 
        myoj.merge( selector, []) :
        myoj.find( selector, context ) 
    );

}

let m = myoj;

myoj.fn = myoj.prototype = {
    myoj: "myoj 0.1",

    size: function () { 
        return this.length; 
    },

    get: function( num ) {
        if ( num && Array.isArray(num) ) {
            this.length = 0;
            [].push.apply( this, num );

            return this;
        } else if ( num == undefined ) {
            return myoj.map( this, ( a ) => a);
        } else 
            return this[num];
    },

    each: function( fn, args ) {
        return myoj.each( this, fn, args );
    },

    index: function( obj ) {
        let pos = -1;
        this.each(function ( i ) {
            if ( this === obj ) pos = i;
        });
        return pos;
    },

    attr: function( key, value, type ) {
        if (typeof key !== 'string' || value != undefined) {
            return this.each(function () {
                if (value == undefined) {
                    for ( let prop in key ) {
                        myoj.attr(
                            type 
                                ? this.style 
                                : this, prop, key[prop]
                        );
                    }
                } else {
                    myoj.attr(
                        type 
                            ? this.style 
                            : this, key, value 
                    );
                }
            });
        }

        return myoj[ type || "attr" ]( this[0], key );
    },

    css: function( key, value ) {
        return this.attr( key, value, "curCSS");
    },

    text: function(e) {
        e = e || this;
        let t = "";
        Array.from(e).forEach((i) => {
            i.childNodes.forEach((j) => {
                t += j.nodeType !== Node.ELEMENT_NODE 
                    ? j.nodeValue 
                    : myoj.fn.text( [ j ] );
            })
        });
        return t;
    },

    wrap: function() {
        let a = myoj.clean(arguments);

        return this.each(function() {
            let b = a[0].cloneNode(true);

            this.parentNode.insertBefore( b, this );

            while ( b.firstChild ) {
                b = b.firstChild;
            }

            b.appendChild( this );
        });
    },
}

myoj.extend = myoj.fn.extend = function(obj, prop) {
    if ( !prop ) { prop = obj; obj = this; }
    for ( let i in prop ) obj[i] = prop[i];
    return obj;
}

myoj.extend({

    find: function(t) {
        if (typeof t !== 'string') return [t];
        return Array.from(document.querySelectorAll(t));
    },

    map: function(elems, fn) {
        return Array.from(elems).map(fn);
    },

    each: function(obj, fn, args) {
        if ( obj.length === undefined )
			    for ( let i in obj )
				    fn.apply( obj[i], args || [i, obj[i]] );
		    else
			    for ( let i = 0; i < obj.length; i++ )
				    fn.apply( obj[i], args || [i, obj[i]] );
		    return obj;
    },

    attr: function(elem, name, value) {
        let fix = {
            "for": "htmlFor",
            "class": "className",
            "float": "cssFloat",
            innerHTML: "innerHTML",
            className: "className"
        };

        if ( fix[name] ) {
            if ( value !== undefined ) elem[fix[name]] = value;
            return elem[fix[name]];
        } else if ( elem.getAttribute ) {
		    if ( value !== undefined ) elem.setAttribute( name, value );
		    return elem.getAttribute( name, 2 );
	    } else {
		    name = name.replace(/-([a-z])/ig,function(z,b){return b.toUpperCase();});
		    if ( value !== undefined ) elem[name] = value;
		    return elem[name];
	    }
    }
});