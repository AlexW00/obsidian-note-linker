define(['module', 'exports', './workerHelpers-91f60ade'], (function (module, exports, workerHelpers) { 'use strict';

    let wasm;

    const heap = new Array(32).fill(undefined);

    heap.push(undefined, null, true, false);

    function getObject(idx) { return heap[idx]; }

    let heap_next = heap.length;

    function dropObject(idx) {
        if (idx < 36) return;
        heap[idx] = heap_next;
        heap_next = idx;
    }

    function takeObject(idx) {
        const ret = getObject(idx);
        dropObject(idx);
        return ret;
    }

    function addHeapObject(obj) {
        if (heap_next === heap.length) heap.push(heap.length + 1);
        const idx = heap_next;
        heap_next = heap[idx];

        heap[idx] = obj;
        return idx;
    }

    let WASM_VECTOR_LEN = 0;

    let cachegetUint8Memory0 = null;
    function getUint8Memory0() {
        if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory0;
    }

    const cachedTextEncoder = new TextEncoder('utf-8');

    const encodeString = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };

    function passStringToWasm0(arg, malloc, realloc) {

        if (realloc === undefined) {
            const buf = cachedTextEncoder.encode(arg);
            const ptr = malloc(buf.length);
            getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len);

        const mem = getUint8Memory0();

        let offset = 0;

        for (; offset < len; offset++) {
            const code = arg.charCodeAt(offset);
            if (code > 0x7F) break;
            mem[ptr + offset] = code;
        }

        if (offset !== len) {
            if (offset !== 0) {
                arg = arg.slice(offset);
            }
            ptr = realloc(ptr, len, len = offset + arg.length * 3);
            const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
            const ret = encodeString(arg, view);

            offset += ret.written;
        }

        WASM_VECTOR_LEN = offset;
        return ptr;
    }

    function isLikeNone(x) {
        return x === undefined || x === null;
    }

    let cachegetInt32Memory0 = null;
    function getInt32Memory0() {
        if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
            cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
        }
        return cachegetInt32Memory0;
    }

    const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

    cachedTextDecoder.decode();

    function getStringFromWasm0(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory0().slice(ptr, ptr + len));
    }

    let cachegetFloat64Memory0 = null;
    function getFloat64Memory0() {
        if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
            cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
        }
        return cachegetFloat64Memory0;
    }

    function debugString(val) {
        // primitive types
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return  `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        // objects
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debugString(val[0]);
            }
            for(let i = 1; i < length; i++) {
                debug += ', ' + debugString(val[i]);
            }
            debug += ']';
            return debug;
        }
        // Test for built-in
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            // Failed to match the standard '[object ClassName]'
            return toString.call(val);
        }
        if (className == 'Object') {
            // we're a user defined class or Object
            // JSON.stringify avoids problems with cycles, and is generally much
            // easier than looping through ownProperties of `val`.
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        // errors
        if (val instanceof Error) {
            return `${val.name}: ${val.message}\n${val.stack}`;
        }
        // TODO we could test for more things here, like `Set`s and `Map`s.
        return className;
    }
    /**
    * @param {any} js
    * @returns {Note | undefined}
    */
    function note_from_js_value(js) {
        const ret = wasm.note_from_js_value(addHeapObject(js));
        return ret === 0 ? undefined : Note.__wrap(ret);
    }

    /**
    * @param {number} a
    * @param {number} b
    * @returns {number}
    */
    function add(a, b) {
        const ret = wasm.add(a, b);
        return ret;
    }

    let stack_pointer = 32;

    function addBorrowedObject(obj) {
        if (stack_pointer == 1) throw new Error('out of js stack');
        heap[--stack_pointer] = obj;
        return stack_pointer;
    }
    /**
    * @param {any} context
    * @param {Array<Note>} notes
    * @param {Function} callback
    * @returns {Array<any>}
    */
    function find(context, notes, callback) {
        try {
            const ret = wasm.find(addBorrowedObject(context), addHeapObject(notes), addBorrowedObject(callback));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }

    /**
    * @param {any} ctx
    * @param {Function} callback
    */
    function set_timeout(ctx, callback) {
        try {
            wasm.set_timeout(addBorrowedObject(ctx), addBorrowedObject(callback));
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }

    function _assertClass(instance, klass) {
        if (!(instance instanceof klass)) {
            throw new Error(`expected instance of ${klass.name}`);
        }
        return instance.ptr;
    }
    /**
    * @param {any} js
    * @returns {Range | undefined}
    */
    function range_from_js_value(js) {
        const ret = wasm.range_from_js_value(addHeapObject(js));
        return ret === 0 ? undefined : Range.__wrap(ret);
    }

    /**
    */
    function init_panic_hook() {
        wasm.init_panic_hook();
    }

    function __wbg_adapter_86(arg0, arg1, arg2, arg3, arg4) {
        const ret = wasm.wasm_bindgen__convert__closures__invoke3_mut__h7cc631d045af0f64(arg0, arg1, addHeapObject(arg2), arg3, addHeapObject(arg4));
        return takeObject(ret);
    }

    function handleError(f, args) {
        try {
            return f.apply(this, args);
        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    }
    /**
    * @param {number} num_threads
    * @returns {Promise<any>}
    */
    function initThreadPool(num_threads) {
        const ret = wasm.initThreadPool(num_threads);
        return takeObject(ret);
    }

    /**
    * @param {number} receiver
    */
    function wbg_rayon_start_worker(receiver) {
        wasm.wbg_rayon_start_worker(receiver);
    }

    /**
    * A text passage, that has been identified as a possible matching
    */
    class LinkMatch {

        static __wrap(ptr) {
            const obj = Object.create(LinkMatch.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_linkmatch_free(ptr);
        }
        /**
        * @returns {Range}
        */
        get position() {
            const ret = wasm.linkmatch_position(this.ptr);
            return Range.__wrap(ret);
        }
        /**
        * @returns {string}
        */
        get matched_text() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.linkmatch_matched_text(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @returns {TextContext}
        */
        get context() {
            const ret = wasm.linkmatch_context(this.ptr);
            return TextContext.__wrap(ret);
        }
        /**
        * @returns {Array<any>}
        */
        get link_match_target_candidate() {
            const ret = wasm.linkmatch_link_match_target_candidate(this.ptr);
            return takeObject(ret);
        }
    }
    /**
    * A candidate note for a matching to matching to
    */
    class LinkTargetCandidate {

        static __wrap(ptr) {
            const obj = Object.create(LinkTargetCandidate.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_linktargetcandidate_free(ptr);
        }
        /**
        * @returns {string}
        */
        get title() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.linktargetcandidate_title(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @returns {string}
        */
        get path() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.linktargetcandidate_path(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @returns {Array<any>}
        */
        get replacement_selection_items() {
            const ret = wasm.linktargetcandidate_replacement_selection_items(this.ptr);
            return takeObject(ret);
        }
        /**
        */
        de_select_all() {
            wasm.linktargetcandidate_de_select_all(this.ptr);
        }
    }
    /**
    */
    class Note {

        static __wrap(ptr) {
            const obj = Object.create(Note.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_note_free(ptr);
        }
        /**
        * @param {string} title
        * @param {string} path
        * @param {string} content
        * @param {Array<string>} aliases
        * @param {Array<Range>} ignore
        */
        constructor(title, path, content, aliases, ignore) {
            const ptr0 = passStringToWasm0(title, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len2 = WASM_VECTOR_LEN;
            const ret = wasm.note_new(ptr0, len0, ptr1, len1, ptr2, len2, addHeapObject(aliases), addHeapObject(ignore));
            return Note.__wrap(ret);
        }
        /**
        * @returns {string}
        */
        get title() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.note_title(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @returns {string}
        */
        get path() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.note_path(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @returns {string}
        */
        get content() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.note_content(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @returns {Array<string>}
        */
        get aliases() {
            const ret = wasm.note_aliases(this.ptr);
            return takeObject(ret);
        }
        /**
        * @returns {Array<Range>}
        */
        get ignore() {
            const ret = wasm.note_ignore(this.ptr);
            return takeObject(ret);
        }
    }
    /**
    */
    class NoteChangeOperation {

        static __wrap(ptr) {
            const obj = Object.create(NoteChangeOperation.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_notechangeoperation_free(ptr);
        }
        /**
        * @param {string} path
        * @param {string} content
        * @param {Array<any>} replacements
        */
        constructor(path, content, replacements) {
            const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ret = wasm.notechangeoperation_new(ptr0, len0, ptr1, len1, addHeapObject(replacements));
            return NoteChangeOperation.__wrap(ret);
        }
        /**
        * @returns {string}
        */
        get path() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.notechangeoperation_path(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @returns {string}
        */
        get content() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.notechangeoperation_content(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @returns {Array<any>}
        */
        get replacements() {
            const ret = wasm.notechangeoperation_replacements(this.ptr);
            return takeObject(ret);
        }
        /**
        * @param {Array<any>} replacements
        */
        set replacements(replacements) {
            wasm.notechangeoperation_set_replacements(this.ptr, addHeapObject(replacements));
        }
        /**
        */
        apply_replacements() {
            wasm.notechangeoperation_apply_replacements(this.ptr);
        }
    }
    /**
    */
    class NoteMatchingResult {

        static __wrap(ptr) {
            const obj = Object.create(NoteMatchingResult.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_notematchingresult_free(ptr);
        }
        /**
        * @returns {Note}
        */
        get note() {
            const ret = wasm.notematchingresult_note(this.ptr);
            return Note.__wrap(ret);
        }
        /**
        * @returns {Array<any>}
        */
        get link_matches() {
            const ret = wasm.notematchingresult_link_matches(this.ptr);
            return takeObject(ret);
        }
    }
    /**
    */
    class NoteScannedEvent {

        static __wrap(ptr) {
            const obj = Object.create(NoteScannedEvent.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_notescannedevent_free(ptr);
        }
        /**
        * @param {Note} note
        */
        constructor(note) {
            _assertClass(note, Note);
            const ret = wasm.notescannedevent_new(note.ptr);
            return NoteScannedEvent.__wrap(ret);
        }
        /**
        * @returns {string}
        */
        get note_title() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.notescannedevent_note_title(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @returns {string}
        */
        get note_path() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.notescannedevent_note_path(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
    }
    /**
    */
    class Range {

        static __wrap(ptr) {
            const obj = Object.create(Range.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_range_free(ptr);
        }
        /**
        * @param {number} start
        * @param {number} end
        */
        constructor(start, end) {
            const ret = wasm.range_new(start, end);
            return Range.__wrap(ret);
        }
        /**
        * @returns {number}
        */
        get start() {
            const ret = wasm.range_start(this.ptr);
            return ret >>> 0;
        }
        /**
        * @returns {number}
        */
        get end() {
            const ret = wasm.range_end(this.ptr);
            return ret >>> 0;
        }
        /**
        * @param {Range} range
        * @returns {boolean}
        */
        is_equal_to(range) {
            _assertClass(range, Range);
            const ret = wasm.range_is_equal_to(this.ptr, range.ptr);
            return ret !== 0;
        }
        /**
        * @param {Range} range
        * @returns {boolean}
        */
        does_overlap(range) {
            _assertClass(range, Range);
            const ret = wasm.range_does_overlap(this.ptr, range.ptr);
            return ret !== 0;
        }
    }
    /**
    */
    class Replacement {

        static __wrap(ptr) {
            const obj = Object.create(Replacement.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_replacement_free(ptr);
        }
        /**
        * @param {Range} position
        * @param {string} substitute
        */
        constructor(position, substitute) {
            _assertClass(position, Range);
            var ptr0 = position.ptr;
            position.ptr = 0;
            const ptr1 = passStringToWasm0(substitute, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ret = wasm.replacement_new(ptr0, ptr1, len1);
            return Replacement.__wrap(ret);
        }
        /**
        * @returns {Range}
        */
        get position() {
            const ret = wasm.replacement_position(this.ptr);
            return Range.__wrap(ret);
        }
        /**
        * @returns {string}
        */
        get substitute() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.replacement_substitute(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
    }
    /**
    * A selectable item
    */
    class SelectionItem {

        static __wrap(ptr) {
            const obj = Object.create(SelectionItem.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_selectionitem_free(ptr);
        }
        /**
        * @param {string} content
        * @param {boolean} is_selected
        */
        constructor(content, is_selected) {
            const ptr0 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.selectionitem_new(ptr0, len0, is_selected);
            return SelectionItem.__wrap(ret);
        }
        /**
        * @returns {string}
        */
        get content() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.selectionitem_content(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @returns {boolean}
        */
        get is_selected() {
            const ret = wasm.selectionitem_is_selected(this.ptr);
            return ret !== 0;
        }
        /**
        * @param {boolean} is_selected
        */
        set is_selected(is_selected) {
            wasm.selectionitem_set_is_selected(this.ptr, is_selected);
        }
    }
    /**
    */
    class TextContext {

        static __wrap(ptr) {
            const obj = Object.create(TextContext.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_textcontext_free(ptr);
        }
        /**
        * @returns {TextContextTail}
        */
        get left_context_tail() {
            const ret = wasm.textcontext_left_context_tail(this.ptr);
            return TextContextTail.__wrap(ret);
        }
        /**
        * @returns {TextContextTail}
        */
        get right_context_tail() {
            const ret = wasm.textcontext_right_context_tail(this.ptr);
            return TextContextTail.__wrap(ret);
        }
        /**
        * @returns {string}
        */
        get match_text() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.textcontext_match_text(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
    }
    /**
    */
    class TextContextTail {

        static __wrap(ptr) {
            const obj = Object.create(TextContextTail.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_textcontexttail_free(ptr);
        }
        /**
        * @returns {string}
        */
        get text() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.textcontexttail_text(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @returns {Range}
        */
        get position() {
            const ret = wasm.textcontexttail_position(this.ptr);
            return Range.__wrap(ret);
        }
    }
    /**
    */
    class wbg_rayon_PoolBuilder {

        static __wrap(ptr) {
            const obj = Object.create(wbg_rayon_PoolBuilder.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_wbg_rayon_poolbuilder_free(ptr);
        }
        /**
        * @returns {number}
        */
        numThreads() {
            const ret = wasm.wbg_rayon_poolbuilder_numThreads(this.ptr);
            return ret >>> 0;
        }
        /**
        * @returns {number}
        */
        receiver() {
            const ret = wasm.wbg_rayon_poolbuilder_receiver(this.ptr);
            return ret;
        }
        /**
        */
        build() {
            wasm.wbg_rayon_poolbuilder_build(this.ptr);
        }
    }

    async function load(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {
            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    async function init(input, maybe_memory) {
        if (typeof input === 'undefined') {
            input = new URL('obsidian_rust_plugin_bg.wasm', module.uri);
        }
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
            takeObject(arg0);
        };
        imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
            const obj = getObject(arg1);
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbg_notescannedevent_new = function(arg0) {
            const ret = NoteScannedEvent.__wrap(arg0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_selectionitem_new = function(arg0) {
            const ret = SelectionItem.__wrap(arg0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_notematchingresult_new = function(arg0) {
            const ret = NoteMatchingResult.__wrap(arg0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_log_14fbe08dff76d4fb = function(arg0, arg1) {
            console.log(getStringFromWasm0(arg0, arg1));
        };
        imports.wbg.__wbg_linkmatch_new = function(arg0) {
            const ret = LinkMatch.__wrap(arg0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_linktargetcandidate_new = function(arg0) {
            const ret = LinkTargetCandidate.__wrap(arg0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
            const ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
            const obj = getObject(arg1);
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
            getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
        };
        imports.wbg.__wbg_get_590a2cd912f2ae46 = function(arg0, arg1) {
            const ret = getObject(arg0)[arg1 >>> 0];
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_length_2cd798326f2cc4c1 = function(arg0) {
            const ret = getObject(arg0).length;
            return ret;
        };
        imports.wbg.__wbg_new_94fb1279cf6afea5 = function() {
            const ret = new Array();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_get_a9cab131e3152c49 = function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(getObject(arg0), getObject(arg1));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_isArray_6721f2e508996340 = function(arg0) {
            const ret = Array.isArray(getObject(arg0));
            return ret;
        };
        imports.wbg.__wbg_map_cbe81bc2aadeb5ae = function(arg0, arg1, arg2) {
            try {
                var state0 = {a: arg1, b: arg2};
                var cb0 = (arg0, arg1, arg2) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return __wbg_adapter_86(a, state0.b, arg0, arg1, arg2);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = getObject(arg0).map(cb0);
                return addHeapObject(ret);
            } finally {
                state0.a = state0.b = 0;
            }
        };
        imports.wbg.__wbg_push_40c6a90f1805aa90 = function(arg0, arg1) {
            const ret = getObject(arg0).push(getObject(arg1));
            return ret;
        };
        imports.wbg.__wbg_apply_f2d0f65c219e5594 = function() { return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).apply(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments) };
        imports.wbg.__wbg_name_ca974f6ed2be667c = function(arg0) {
            const ret = getObject(arg0).name;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_constructor_5abd6dfea8e0d4ee = function(arg0) {
            const ret = getObject(arg0).constructor;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_getPrototypeOf_34c9223646177256 = function(arg0) {
            const ret = Object.getPrototypeOf(getObject(arg0));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_new_693216e109162396 = function() {
            const ret = new Error();
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
            const ret = getObject(arg1).stack;
            const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
            try {
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(arg0, arg1);
            }
        };
        imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
            const ret = debugString(getObject(arg1));
            const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        };
        imports.wbg.__wbindgen_module = function() {
            const ret = init.__wbindgen_wasm_module;
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_memory = function() {
            const ret = wasm.memory;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_startWorkers_04f63eca19916b8f = function(arg0, arg1, arg2) {
            const ret = workerHelpers.startWorkers(takeObject(arg0), takeObject(arg1), wbg_rayon_PoolBuilder.__wrap(arg2));
            return addHeapObject(ret);
        };

        if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
            input = fetch(input);
        }

        imports.wbg.memory = maybe_memory || new WebAssembly.Memory({initial:23,maximum:16384,shared:true});

        const { instance, module: module$1 } = await load(await input, imports);

        wasm = instance.exports;
        init.__wbindgen_wasm_module = module$1;
        wasm.__wbindgen_start();
        return wasm;
    }

    exports.LinkMatch = LinkMatch;
    exports.LinkTargetCandidate = LinkTargetCandidate;
    exports.Note = Note;
    exports.NoteChangeOperation = NoteChangeOperation;
    exports.NoteMatchingResult = NoteMatchingResult;
    exports.NoteScannedEvent = NoteScannedEvent;
    exports.Range = Range;
    exports.Replacement = Replacement;
    exports.SelectionItem = SelectionItem;
    exports.TextContext = TextContext;
    exports.TextContextTail = TextContextTail;
    exports.add = add;
    exports["default"] = init;
    exports.find = find;
    exports.initThreadPool = initThreadPool;
    exports.init_panic_hook = init_panic_hook;
    exports.note_from_js_value = note_from_js_value;
    exports.range_from_js_value = range_from_js_value;
    exports.set_timeout = set_timeout;
    exports.wbg_rayon_PoolBuilder = wbg_rayon_PoolBuilder;
    exports.wbg_rayon_start_worker = wbg_rayon_start_worker;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzaWRpYW5fcnVzdF9wbHVnaW4tMTYzZjVlMjIuanMiLCJzb3VyY2VzIjpbIi4uL3BrZy9vYnNpZGlhbl9ydXN0X3BsdWdpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzdGFydFdvcmtlcnMgfSBmcm9tICcuL3NuaXBwZXRzL3dhc20tYmluZGdlbi1yYXlvbi03YWZhODk5ZjM2NjY1NDczL3NyYy93b3JrZXJIZWxwZXJzLmpzJztcblxubGV0IHdhc207XG5cbmNvbnN0IGhlYXAgPSBuZXcgQXJyYXkoMzIpLmZpbGwodW5kZWZpbmVkKTtcblxuaGVhcC5wdXNoKHVuZGVmaW5lZCwgbnVsbCwgdHJ1ZSwgZmFsc2UpO1xuXG5mdW5jdGlvbiBnZXRPYmplY3QoaWR4KSB7IHJldHVybiBoZWFwW2lkeF07IH1cblxubGV0IGhlYXBfbmV4dCA9IGhlYXAubGVuZ3RoO1xuXG5mdW5jdGlvbiBkcm9wT2JqZWN0KGlkeCkge1xuICAgIGlmIChpZHggPCAzNikgcmV0dXJuO1xuICAgIGhlYXBbaWR4XSA9IGhlYXBfbmV4dDtcbiAgICBoZWFwX25leHQgPSBpZHg7XG59XG5cbmZ1bmN0aW9uIHRha2VPYmplY3QoaWR4KSB7XG4gICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGlkeCk7XG4gICAgZHJvcE9iamVjdChpZHgpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGFkZEhlYXBPYmplY3Qob2JqKSB7XG4gICAgaWYgKGhlYXBfbmV4dCA9PT0gaGVhcC5sZW5ndGgpIGhlYXAucHVzaChoZWFwLmxlbmd0aCArIDEpO1xuICAgIGNvbnN0IGlkeCA9IGhlYXBfbmV4dDtcbiAgICBoZWFwX25leHQgPSBoZWFwW2lkeF07XG5cbiAgICBoZWFwW2lkeF0gPSBvYmo7XG4gICAgcmV0dXJuIGlkeDtcbn1cblxubGV0IFdBU01fVkVDVE9SX0xFTiA9IDA7XG5cbmxldCBjYWNoZWdldFVpbnQ4TWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXRVaW50OE1lbW9yeTAoKSB7XG4gICAgaWYgKGNhY2hlZ2V0VWludDhNZW1vcnkwID09PSBudWxsIHx8IGNhY2hlZ2V0VWludDhNZW1vcnkwLmJ1ZmZlciAhPT0gd2FzbS5tZW1vcnkuYnVmZmVyKSB7XG4gICAgICAgIGNhY2hlZ2V0VWludDhNZW1vcnkwID0gbmV3IFVpbnQ4QXJyYXkod2FzbS5tZW1vcnkuYnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZ2V0VWludDhNZW1vcnkwO1xufVxuXG5jb25zdCBjYWNoZWRUZXh0RW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigndXRmLTgnKTtcblxuY29uc3QgZW5jb2RlU3RyaW5nID0gZnVuY3Rpb24gKGFyZywgdmlldykge1xuICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpO1xuICAgIHZpZXcuc2V0KGJ1Zik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVhZDogYXJnLmxlbmd0aCxcbiAgICAgICAgd3JpdHRlbjogYnVmLmxlbmd0aFxuICAgIH07XG59O1xuXG5mdW5jdGlvbiBwYXNzU3RyaW5nVG9XYXNtMChhcmcsIG1hbGxvYywgcmVhbGxvYykge1xuXG4gICAgaWYgKHJlYWxsb2MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBidWYgPSBjYWNoZWRUZXh0RW5jb2Rlci5lbmNvZGUoYXJnKTtcbiAgICAgICAgY29uc3QgcHRyID0gbWFsbG9jKGJ1Zi5sZW5ndGgpO1xuICAgICAgICBnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGJ1Zi5sZW5ndGgpLnNldChidWYpO1xuICAgICAgICBXQVNNX1ZFQ1RPUl9MRU4gPSBidWYubGVuZ3RoO1xuICAgICAgICByZXR1cm4gcHRyO1xuICAgIH1cblxuICAgIGxldCBsZW4gPSBhcmcubGVuZ3RoO1xuICAgIGxldCBwdHIgPSBtYWxsb2MobGVuKTtcblxuICAgIGNvbnN0IG1lbSA9IGdldFVpbnQ4TWVtb3J5MCgpO1xuXG4gICAgbGV0IG9mZnNldCA9IDA7XG5cbiAgICBmb3IgKDsgb2Zmc2V0IDwgbGVuOyBvZmZzZXQrKykge1xuICAgICAgICBjb25zdCBjb2RlID0gYXJnLmNoYXJDb2RlQXQob2Zmc2V0KTtcbiAgICAgICAgaWYgKGNvZGUgPiAweDdGKSBicmVhaztcbiAgICAgICAgbWVtW3B0ciArIG9mZnNldF0gPSBjb2RlO1xuICAgIH1cblxuICAgIGlmIChvZmZzZXQgIT09IGxlbikge1xuICAgICAgICBpZiAob2Zmc2V0ICE9PSAwKSB7XG4gICAgICAgICAgICBhcmcgPSBhcmcuc2xpY2Uob2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgICBwdHIgPSByZWFsbG9jKHB0ciwgbGVuLCBsZW4gPSBvZmZzZXQgKyBhcmcubGVuZ3RoICogMyk7XG4gICAgICAgIGNvbnN0IHZpZXcgPSBnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIgKyBvZmZzZXQsIHB0ciArIGxlbik7XG4gICAgICAgIGNvbnN0IHJldCA9IGVuY29kZVN0cmluZyhhcmcsIHZpZXcpO1xuXG4gICAgICAgIG9mZnNldCArPSByZXQud3JpdHRlbjtcbiAgICB9XG5cbiAgICBXQVNNX1ZFQ1RPUl9MRU4gPSBvZmZzZXQ7XG4gICAgcmV0dXJuIHB0cjtcbn1cblxuZnVuY3Rpb24gaXNMaWtlTm9uZSh4KSB7XG4gICAgcmV0dXJuIHggPT09IHVuZGVmaW5lZCB8fCB4ID09PSBudWxsO1xufVxuXG5sZXQgY2FjaGVnZXRJbnQzMk1lbW9yeTAgPSBudWxsO1xuZnVuY3Rpb24gZ2V0SW50MzJNZW1vcnkwKCkge1xuICAgIGlmIChjYWNoZWdldEludDMyTWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWdldEludDMyTWVtb3J5MC5idWZmZXIgIT09IHdhc20ubWVtb3J5LmJ1ZmZlcikge1xuICAgICAgICBjYWNoZWdldEludDMyTWVtb3J5MCA9IG5ldyBJbnQzMkFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWdldEludDMyTWVtb3J5MDtcbn1cblxuY29uc3QgY2FjaGVkVGV4dERlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoJ3V0Zi04JywgeyBpZ25vcmVCT006IHRydWUsIGZhdGFsOiB0cnVlIH0pO1xuXG5jYWNoZWRUZXh0RGVjb2Rlci5kZWNvZGUoKTtcblxuZnVuY3Rpb24gZ2V0U3RyaW5nRnJvbVdhc20wKHB0ciwgbGVuKSB7XG4gICAgcmV0dXJuIGNhY2hlZFRleHREZWNvZGVyLmRlY29kZShnZXRVaW50OE1lbW9yeTAoKS5zbGljZShwdHIsIHB0ciArIGxlbikpO1xufVxuXG5sZXQgY2FjaGVnZXRGbG9hdDY0TWVtb3J5MCA9IG51bGw7XG5mdW5jdGlvbiBnZXRGbG9hdDY0TWVtb3J5MCgpIHtcbiAgICBpZiAoY2FjaGVnZXRGbG9hdDY0TWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWdldEZsb2F0NjRNZW1vcnkwLmJ1ZmZlciAhPT0gd2FzbS5tZW1vcnkuYnVmZmVyKSB7XG4gICAgICAgIGNhY2hlZ2V0RmxvYXQ2NE1lbW9yeTAgPSBuZXcgRmxvYXQ2NEFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7XG4gICAgfVxuICAgIHJldHVybiBjYWNoZWdldEZsb2F0NjRNZW1vcnkwO1xufVxuXG5mdW5jdGlvbiBkZWJ1Z1N0cmluZyh2YWwpIHtcbiAgICAvLyBwcmltaXRpdmUgdHlwZXNcbiAgICBjb25zdCB0eXBlID0gdHlwZW9mIHZhbDtcbiAgICBpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdib29sZWFuJyB8fCB2YWwgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gIGAke3ZhbH1gO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gYFwiJHt2YWx9XCJgO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PSAnc3ltYm9sJykge1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHZhbC5kZXNjcmlwdGlvbjtcbiAgICAgICAgaWYgKGRlc2NyaXB0aW9uID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiAnU3ltYm9sJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgU3ltYm9sKCR7ZGVzY3JpcHRpb259KWA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCBuYW1lID0gdmFsLm5hbWU7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJyAmJiBuYW1lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgRnVuY3Rpb24oJHtuYW1lfSlgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICdGdW5jdGlvbic7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gb2JqZWN0c1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdmFsLmxlbmd0aDtcbiAgICAgICAgbGV0IGRlYnVnID0gJ1snO1xuICAgICAgICBpZiAobGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZGVidWcgKz0gZGVidWdTdHJpbmcodmFsWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IobGV0IGkgPSAxOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGRlYnVnICs9ICcsICcgKyBkZWJ1Z1N0cmluZyh2YWxbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGRlYnVnICs9ICddJztcbiAgICAgICAgcmV0dXJuIGRlYnVnO1xuICAgIH1cbiAgICAvLyBUZXN0IGZvciBidWlsdC1pblxuICAgIGNvbnN0IGJ1aWx0SW5NYXRjaGVzID0gL1xcW29iamVjdCAoW15cXF1dKylcXF0vLmV4ZWModG9TdHJpbmcuY2FsbCh2YWwpKTtcbiAgICBsZXQgY2xhc3NOYW1lO1xuICAgIGlmIChidWlsdEluTWF0Y2hlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNsYXNzTmFtZSA9IGJ1aWx0SW5NYXRjaGVzWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZhaWxlZCB0byBtYXRjaCB0aGUgc3RhbmRhcmQgJ1tvYmplY3QgQ2xhc3NOYW1lXSdcbiAgICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKTtcbiAgICB9XG4gICAgaWYgKGNsYXNzTmFtZSA9PSAnT2JqZWN0Jykge1xuICAgICAgICAvLyB3ZSdyZSBhIHVzZXIgZGVmaW5lZCBjbGFzcyBvciBPYmplY3RcbiAgICAgICAgLy8gSlNPTi5zdHJpbmdpZnkgYXZvaWRzIHByb2JsZW1zIHdpdGggY3ljbGVzLCBhbmQgaXMgZ2VuZXJhbGx5IG11Y2hcbiAgICAgICAgLy8gZWFzaWVyIHRoYW4gbG9vcGluZyB0aHJvdWdoIG93blByb3BlcnRpZXMgb2YgYHZhbGAuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gJ09iamVjdCgnICsgSlNPTi5zdHJpbmdpZnkodmFsKSArICcpJztcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgICAgcmV0dXJuICdPYmplY3QnO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGVycm9yc1xuICAgIGlmICh2YWwgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICByZXR1cm4gYCR7dmFsLm5hbWV9OiAke3ZhbC5tZXNzYWdlfVxcbiR7dmFsLnN0YWNrfWA7XG4gICAgfVxuICAgIC8vIFRPRE8gd2UgY291bGQgdGVzdCBmb3IgbW9yZSB0aGluZ3MgaGVyZSwgbGlrZSBgU2V0YHMgYW5kIGBNYXBgcy5cbiAgICByZXR1cm4gY2xhc3NOYW1lO1xufVxuLyoqXG4qIEBwYXJhbSB7YW55fSBqc1xuKiBAcmV0dXJucyB7Tm90ZSB8IHVuZGVmaW5lZH1cbiovXG5leHBvcnQgZnVuY3Rpb24gbm90ZV9mcm9tX2pzX3ZhbHVlKGpzKSB7XG4gICAgY29uc3QgcmV0ID0gd2FzbS5ub3RlX2Zyb21fanNfdmFsdWUoYWRkSGVhcE9iamVjdChqcykpO1xuICAgIHJldHVybiByZXQgPT09IDAgPyB1bmRlZmluZWQgOiBOb3RlLl9fd3JhcChyZXQpO1xufVxuXG4vKipcbiogQHBhcmFtIHtudW1iZXJ9IGFcbiogQHBhcmFtIHtudW1iZXJ9IGJcbiogQHJldHVybnMge251bWJlcn1cbiovXG5leHBvcnQgZnVuY3Rpb24gYWRkKGEsIGIpIHtcbiAgICBjb25zdCByZXQgPSB3YXNtLmFkZChhLCBiKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG5sZXQgc3RhY2tfcG9pbnRlciA9IDMyO1xuXG5mdW5jdGlvbiBhZGRCb3Jyb3dlZE9iamVjdChvYmopIHtcbiAgICBpZiAoc3RhY2tfcG9pbnRlciA9PSAxKSB0aHJvdyBuZXcgRXJyb3IoJ291dCBvZiBqcyBzdGFjaycpO1xuICAgIGhlYXBbLS1zdGFja19wb2ludGVyXSA9IG9iajtcbiAgICByZXR1cm4gc3RhY2tfcG9pbnRlcjtcbn1cbi8qKlxuKiBAcGFyYW0ge2FueX0gY29udGV4dFxuKiBAcGFyYW0ge0FycmF5PE5vdGU+fSBub3Rlc1xuKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuKiBAcmV0dXJucyB7QXJyYXk8YW55Pn1cbiovXG5leHBvcnQgZnVuY3Rpb24gZmluZChjb250ZXh0LCBub3RlcywgY2FsbGJhY2spIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXQgPSB3YXNtLmZpbmQoYWRkQm9ycm93ZWRPYmplY3QoY29udGV4dCksIGFkZEhlYXBPYmplY3Qobm90ZXMpLCBhZGRCb3Jyb3dlZE9iamVjdChjYWxsYmFjaykpO1xuICAgICAgICByZXR1cm4gdGFrZU9iamVjdChyZXQpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICAgIGhlYXBbc3RhY2tfcG9pbnRlcisrXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgaGVhcFtzdGFja19wb2ludGVyKytdID0gdW5kZWZpbmVkO1xuICAgIH1cbn1cblxuLyoqXG4qIEBwYXJhbSB7YW55fSBjdHhcbiogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiovXG5leHBvcnQgZnVuY3Rpb24gc2V0X3RpbWVvdXQoY3R4LCBjYWxsYmFjaykge1xuICAgIHRyeSB7XG4gICAgICAgIHdhc20uc2V0X3RpbWVvdXQoYWRkQm9ycm93ZWRPYmplY3QoY3R4KSwgYWRkQm9ycm93ZWRPYmplY3QoY2FsbGJhY2spKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgICBoZWFwW3N0YWNrX3BvaW50ZXIrK10gPSB1bmRlZmluZWQ7XG4gICAgICAgIGhlYXBbc3RhY2tfcG9pbnRlcisrXSA9IHVuZGVmaW5lZDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIF9hc3NlcnRDbGFzcyhpbnN0YW5jZSwga2xhc3MpIHtcbiAgICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIGtsYXNzKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGV4cGVjdGVkIGluc3RhbmNlIG9mICR7a2xhc3MubmFtZX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGluc3RhbmNlLnB0cjtcbn1cbi8qKlxuKiBAcGFyYW0ge2FueX0ganNcbiogQHJldHVybnMge1JhbmdlIHwgdW5kZWZpbmVkfVxuKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5nZV9mcm9tX2pzX3ZhbHVlKGpzKSB7XG4gICAgY29uc3QgcmV0ID0gd2FzbS5yYW5nZV9mcm9tX2pzX3ZhbHVlKGFkZEhlYXBPYmplY3QoanMpKTtcbiAgICByZXR1cm4gcmV0ID09PSAwID8gdW5kZWZpbmVkIDogUmFuZ2UuX193cmFwKHJldCk7XG59XG5cbi8qKlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0X3BhbmljX2hvb2soKSB7XG4gICAgd2FzbS5pbml0X3BhbmljX2hvb2soKTtcbn1cblxuZnVuY3Rpb24gX193YmdfYWRhcHRlcl84NihhcmcwLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0KSB7XG4gICAgY29uc3QgcmV0ID0gd2FzbS53YXNtX2JpbmRnZW5fX2NvbnZlcnRfX2Nsb3N1cmVzX19pbnZva2UzX211dF9faDdjYzYzMWQwNDVhZjBmNjQoYXJnMCwgYXJnMSwgYWRkSGVhcE9iamVjdChhcmcyKSwgYXJnMywgYWRkSGVhcE9iamVjdChhcmc0KSk7XG4gICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRXJyb3IoZiwgYXJncykge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBmLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2V4bl9zdG9yZShhZGRIZWFwT2JqZWN0KGUpKTtcbiAgICB9XG59XG4vKipcbiogQHBhcmFtIHtudW1iZXJ9IG51bV90aHJlYWRzXG4qIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRUaHJlYWRQb29sKG51bV90aHJlYWRzKSB7XG4gICAgY29uc3QgcmV0ID0gd2FzbS5pbml0VGhyZWFkUG9vbChudW1fdGhyZWFkcyk7XG4gICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTtcbn1cblxuLyoqXG4qIEBwYXJhbSB7bnVtYmVyfSByZWNlaXZlclxuKi9cbmV4cG9ydCBmdW5jdGlvbiB3YmdfcmF5b25fc3RhcnRfd29ya2VyKHJlY2VpdmVyKSB7XG4gICAgd2FzbS53YmdfcmF5b25fc3RhcnRfd29ya2VyKHJlY2VpdmVyKTtcbn1cblxuLyoqXG4qIEEgdGV4dCBwYXNzYWdlLCB0aGF0IGhhcyBiZWVuIGlkZW50aWZpZWQgYXMgYSBwb3NzaWJsZSBtYXRjaGluZ1xuKi9cbmV4cG9ydCBjbGFzcyBMaW5rTWF0Y2gge1xuXG4gICAgc3RhdGljIF9fd3JhcChwdHIpIHtcbiAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShMaW5rTWF0Y2gucHJvdG90eXBlKTtcbiAgICAgICAgb2JqLnB0ciA9IHB0cjtcblxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHtcbiAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7XG4gICAgICAgIHRoaXMucHRyID0gMDtcblxuICAgICAgICByZXR1cm4gcHRyO1xuICAgIH1cblxuICAgIGZyZWUoKSB7XG4gICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7XG4gICAgICAgIHdhc20uX193YmdfbGlua21hdGNoX2ZyZWUocHRyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBAcmV0dXJucyB7UmFuZ2V9XG4gICAgKi9cbiAgICBnZXQgcG9zaXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHdhc20ubGlua21hdGNoX3Bvc2l0aW9uKHRoaXMucHRyKTtcbiAgICAgICAgcmV0dXJuIFJhbmdlLl9fd3JhcChyZXQpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgKi9cbiAgICBnZXQgbWF0Y2hlZF90ZXh0KCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgICAgICB3YXNtLmxpbmttYXRjaF9tYXRjaGVkX3RleHQocmV0cHRyLCB0aGlzLnB0cik7XG4gICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtUZXh0Q29udGV4dH1cbiAgICAqL1xuICAgIGdldCBjb250ZXh0KCkge1xuICAgICAgICBjb25zdCByZXQgPSB3YXNtLmxpbmttYXRjaF9jb250ZXh0KHRoaXMucHRyKTtcbiAgICAgICAgcmV0dXJuIFRleHRDb250ZXh0Ll9fd3JhcChyZXQpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtBcnJheTxhbnk+fVxuICAgICovXG4gICAgZ2V0IGxpbmtfbWF0Y2hfdGFyZ2V0X2NhbmRpZGF0ZSgpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS5saW5rbWF0Y2hfbGlua19tYXRjaF90YXJnZXRfY2FuZGlkYXRlKHRoaXMucHRyKTtcbiAgICAgICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTtcbiAgICB9XG59XG4vKipcbiogQSBjYW5kaWRhdGUgbm90ZSBmb3IgYSBtYXRjaGluZyB0byBtYXRjaGluZyB0b1xuKi9cbmV4cG9ydCBjbGFzcyBMaW5rVGFyZ2V0Q2FuZGlkYXRlIHtcblxuICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoTGlua1RhcmdldENhbmRpZGF0ZS5wcm90b3R5cGUpO1xuICAgICAgICBvYmoucHRyID0gcHRyO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgX19kZXN0cm95X2ludG9fcmF3KCkge1xuICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjtcbiAgICAgICAgdGhpcy5wdHIgPSAwO1xuXG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgZnJlZSgpIHtcbiAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTtcbiAgICAgICAgd2FzbS5fX3diZ19saW5rdGFyZ2V0Y2FuZGlkYXRlX2ZyZWUocHRyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICovXG4gICAgZ2V0IHRpdGxlKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgICAgICB3YXNtLmxpbmt0YXJnZXRjYW5kaWRhdGVfdGl0bGUocmV0cHRyLCB0aGlzLnB0cik7XG4gICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgKi9cbiAgICBnZXQgcGF0aCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICAgICAgd2FzbS5saW5rdGFyZ2V0Y2FuZGlkYXRlX3BhdGgocmV0cHRyLCB0aGlzLnB0cik7XG4gICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtBcnJheTxhbnk+fVxuICAgICovXG4gICAgZ2V0IHJlcGxhY2VtZW50X3NlbGVjdGlvbl9pdGVtcygpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS5saW5rdGFyZ2V0Y2FuZGlkYXRlX3JlcGxhY2VtZW50X3NlbGVjdGlvbl9pdGVtcyh0aGlzLnB0cik7XG4gICAgICAgIHJldHVybiB0YWtlT2JqZWN0KHJldCk7XG4gICAgfVxuICAgIC8qKlxuICAgICovXG4gICAgZGVfc2VsZWN0X2FsbCgpIHtcbiAgICAgICAgd2FzbS5saW5rdGFyZ2V0Y2FuZGlkYXRlX2RlX3NlbGVjdF9hbGwodGhpcy5wdHIpO1xuICAgIH1cbn1cbi8qKlxuKi9cbmV4cG9ydCBjbGFzcyBOb3RlIHtcblxuICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoTm90ZS5wcm90b3R5cGUpO1xuICAgICAgICBvYmoucHRyID0gcHRyO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgX19kZXN0cm95X2ludG9fcmF3KCkge1xuICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjtcbiAgICAgICAgdGhpcy5wdHIgPSAwO1xuXG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgZnJlZSgpIHtcbiAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTtcbiAgICAgICAgd2FzbS5fX3diZ19ub3RlX2ZyZWUocHRyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGVcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxuICAgICogQHBhcmFtIHtBcnJheTxzdHJpbmc+fSBhbGlhc2VzXG4gICAgKiBAcGFyYW0ge0FycmF5PFJhbmdlPn0gaWdub3JlXG4gICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0aXRsZSwgcGF0aCwgY29udGVudCwgYWxpYXNlcywgaWdub3JlKSB7XG4gICAgICAgIGNvbnN0IHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMCh0aXRsZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICBjb25zdCBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBjb25zdCBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAocGF0aCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICBjb25zdCBsZW4xID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBjb25zdCBwdHIyID0gcGFzc1N0cmluZ1RvV2FzbTAoY29udGVudCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICBjb25zdCBsZW4yID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBjb25zdCByZXQgPSB3YXNtLm5vdGVfbmV3KHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEsIHB0cjIsIGxlbjIsIGFkZEhlYXBPYmplY3QoYWxpYXNlcyksIGFkZEhlYXBPYmplY3QoaWdub3JlKSk7XG4gICAgICAgIHJldHVybiBOb3RlLl9fd3JhcChyZXQpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgKi9cbiAgICBnZXQgdGl0bGUoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgICAgIHdhc20ubm90ZV90aXRsZShyZXRwdHIsIHRoaXMucHRyKTtcbiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAqL1xuICAgIGdldCBwYXRoKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgICAgICB3YXNtLm5vdGVfcGF0aChyZXRwdHIsIHRoaXMucHRyKTtcbiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAqL1xuICAgIGdldCBjb250ZW50KCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgICAgICB3YXNtLm5vdGVfY29udGVudChyZXRwdHIsIHRoaXMucHRyKTtcbiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICogQHJldHVybnMge0FycmF5PHN0cmluZz59XG4gICAgKi9cbiAgICBnZXQgYWxpYXNlcygpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS5ub3RlX2FsaWFzZXModGhpcy5wdHIpO1xuICAgICAgICByZXR1cm4gdGFrZU9iamVjdChyZXQpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtBcnJheTxSYW5nZT59XG4gICAgKi9cbiAgICBnZXQgaWdub3JlKCkge1xuICAgICAgICBjb25zdCByZXQgPSB3YXNtLm5vdGVfaWdub3JlKHRoaXMucHRyKTtcbiAgICAgICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTtcbiAgICB9XG59XG4vKipcbiovXG5leHBvcnQgY2xhc3MgTm90ZUNoYW5nZU9wZXJhdGlvbiB7XG5cbiAgICBzdGF0aWMgX193cmFwKHB0cikge1xuICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKE5vdGVDaGFuZ2VPcGVyYXRpb24ucHJvdG90eXBlKTtcbiAgICAgICAgb2JqLnB0ciA9IHB0cjtcblxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHtcbiAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7XG4gICAgICAgIHRoaXMucHRyID0gMDtcblxuICAgICAgICByZXR1cm4gcHRyO1xuICAgIH1cblxuICAgIGZyZWUoKSB7XG4gICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7XG4gICAgICAgIHdhc20uX193Ymdfbm90ZWNoYW5nZW9wZXJhdGlvbl9mcmVlKHB0cik7XG4gICAgfVxuICAgIC8qKlxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50XG4gICAgKiBAcGFyYW0ge0FycmF5PGFueT59IHJlcGxhY2VtZW50c1xuICAgICovXG4gICAgY29uc3RydWN0b3IocGF0aCwgY29udGVudCwgcmVwbGFjZW1lbnRzKSB7XG4gICAgICAgIGNvbnN0IHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChwYXRoLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIGNvbnN0IGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIGNvbnN0IHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMChjb250ZW50LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIGNvbnN0IGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47XG4gICAgICAgIGNvbnN0IHJldCA9IHdhc20ubm90ZWNoYW5nZW9wZXJhdGlvbl9uZXcocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSwgYWRkSGVhcE9iamVjdChyZXBsYWNlbWVudHMpKTtcbiAgICAgICAgcmV0dXJuIE5vdGVDaGFuZ2VPcGVyYXRpb24uX193cmFwKHJldCk7XG4gICAgfVxuICAgIC8qKlxuICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAqL1xuICAgIGdldCBwYXRoKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgICAgICB3YXNtLm5vdGVjaGFuZ2VvcGVyYXRpb25fcGF0aChyZXRwdHIsIHRoaXMucHRyKTtcbiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAqL1xuICAgIGdldCBjb250ZW50KCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgICAgICB3YXNtLm5vdGVjaGFuZ2VvcGVyYXRpb25fY29udGVudChyZXRwdHIsIHRoaXMucHRyKTtcbiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTtcbiAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTtcbiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICogQHJldHVybnMge0FycmF5PGFueT59XG4gICAgKi9cbiAgICBnZXQgcmVwbGFjZW1lbnRzKCkge1xuICAgICAgICBjb25zdCByZXQgPSB3YXNtLm5vdGVjaGFuZ2VvcGVyYXRpb25fcmVwbGFjZW1lbnRzKHRoaXMucHRyKTtcbiAgICAgICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBAcGFyYW0ge0FycmF5PGFueT59IHJlcGxhY2VtZW50c1xuICAgICovXG4gICAgc2V0IHJlcGxhY2VtZW50cyhyZXBsYWNlbWVudHMpIHtcbiAgICAgICAgd2FzbS5ub3RlY2hhbmdlb3BlcmF0aW9uX3NldF9yZXBsYWNlbWVudHModGhpcy5wdHIsIGFkZEhlYXBPYmplY3QocmVwbGFjZW1lbnRzKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICovXG4gICAgYXBwbHlfcmVwbGFjZW1lbnRzKCkge1xuICAgICAgICB3YXNtLm5vdGVjaGFuZ2VvcGVyYXRpb25fYXBwbHlfcmVwbGFjZW1lbnRzKHRoaXMucHRyKTtcbiAgICB9XG59XG4vKipcbiovXG5leHBvcnQgY2xhc3MgTm90ZU1hdGNoaW5nUmVzdWx0IHtcblxuICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoTm90ZU1hdGNoaW5nUmVzdWx0LnByb3RvdHlwZSk7XG4gICAgICAgIG9iai5wdHIgPSBwdHI7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7XG4gICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyO1xuICAgICAgICB0aGlzLnB0ciA9IDA7XG5cbiAgICAgICAgcmV0dXJuIHB0cjtcbiAgICB9XG5cbiAgICBmcmVlKCkge1xuICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpO1xuICAgICAgICB3YXNtLl9fd2JnX25vdGVtYXRjaGluZ3Jlc3VsdF9mcmVlKHB0cik7XG4gICAgfVxuICAgIC8qKlxuICAgICogQHJldHVybnMge05vdGV9XG4gICAgKi9cbiAgICBnZXQgbm90ZSgpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS5ub3RlbWF0Y2hpbmdyZXN1bHRfbm90ZSh0aGlzLnB0cik7XG4gICAgICAgIHJldHVybiBOb3RlLl9fd3JhcChyZXQpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtBcnJheTxhbnk+fVxuICAgICovXG4gICAgZ2V0IGxpbmtfbWF0Y2hlcygpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS5ub3RlbWF0Y2hpbmdyZXN1bHRfbGlua19tYXRjaGVzKHRoaXMucHRyKTtcbiAgICAgICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTtcbiAgICB9XG59XG4vKipcbiovXG5leHBvcnQgY2xhc3MgTm90ZVNjYW5uZWRFdmVudCB7XG5cbiAgICBzdGF0aWMgX193cmFwKHB0cikge1xuICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKE5vdGVTY2FubmVkRXZlbnQucHJvdG90eXBlKTtcbiAgICAgICAgb2JqLnB0ciA9IHB0cjtcblxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHtcbiAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7XG4gICAgICAgIHRoaXMucHRyID0gMDtcblxuICAgICAgICByZXR1cm4gcHRyO1xuICAgIH1cblxuICAgIGZyZWUoKSB7XG4gICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7XG4gICAgICAgIHdhc20uX193Ymdfbm90ZXNjYW5uZWRldmVudF9mcmVlKHB0cik7XG4gICAgfVxuICAgIC8qKlxuICAgICogQHBhcmFtIHtOb3RlfSBub3RlXG4gICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihub3RlKSB7XG4gICAgICAgIF9hc3NlcnRDbGFzcyhub3RlLCBOb3RlKTtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS5ub3Rlc2Nhbm5lZGV2ZW50X25ldyhub3RlLnB0cik7XG4gICAgICAgIHJldHVybiBOb3RlU2Nhbm5lZEV2ZW50Ll9fd3JhcChyZXQpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgKi9cbiAgICBnZXQgbm90ZV90aXRsZSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICAgICAgd2FzbS5ub3Rlc2Nhbm5lZGV2ZW50X25vdGVfdGl0bGUocmV0cHRyLCB0aGlzLnB0cik7XG4gICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgKi9cbiAgICBnZXQgbm90ZV9wYXRoKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgICAgICB3YXNtLm5vdGVzY2FubmVkZXZlbnRfbm90ZV9wYXRoKHJldHB0ciwgdGhpcy5wdHIpO1xuICAgICAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdO1xuICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdO1xuICAgICAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTtcbiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiovXG5leHBvcnQgY2xhc3MgUmFuZ2Uge1xuXG4gICAgc3RhdGljIF9fd3JhcChwdHIpIHtcbiAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShSYW5nZS5wcm90b3R5cGUpO1xuICAgICAgICBvYmoucHRyID0gcHRyO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgX19kZXN0cm95X2ludG9fcmF3KCkge1xuICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjtcbiAgICAgICAgdGhpcy5wdHIgPSAwO1xuXG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgZnJlZSgpIHtcbiAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTtcbiAgICAgICAgd2FzbS5fX3diZ19yYW5nZV9mcmVlKHB0cik7XG4gICAgfVxuICAgIC8qKlxuICAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0XG4gICAgKiBAcGFyYW0ge251bWJlcn0gZW5kXG4gICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdGFydCwgZW5kKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHdhc20ucmFuZ2VfbmV3KHN0YXJ0LCBlbmQpO1xuICAgICAgICByZXR1cm4gUmFuZ2UuX193cmFwKHJldCk7XG4gICAgfVxuICAgIC8qKlxuICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAqL1xuICAgIGdldCBzdGFydCgpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS5yYW5nZV9zdGFydCh0aGlzLnB0cik7XG4gICAgICAgIHJldHVybiByZXQgPj4+IDA7XG4gICAgfVxuICAgIC8qKlxuICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAqL1xuICAgIGdldCBlbmQoKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHdhc20ucmFuZ2VfZW5kKHRoaXMucHRyKTtcbiAgICAgICAgcmV0dXJuIHJldCA+Pj4gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBAcGFyYW0ge1JhbmdlfSByYW5nZVxuICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgKi9cbiAgICBpc19lcXVhbF90byhyYW5nZSkge1xuICAgICAgICBfYXNzZXJ0Q2xhc3MocmFuZ2UsIFJhbmdlKTtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS5yYW5nZV9pc19lcXVhbF90byh0aGlzLnB0ciwgcmFuZ2UucHRyKTtcbiAgICAgICAgcmV0dXJuIHJldCAhPT0gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBAcGFyYW0ge1JhbmdlfSByYW5nZVxuICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgKi9cbiAgICBkb2VzX292ZXJsYXAocmFuZ2UpIHtcbiAgICAgICAgX2Fzc2VydENsYXNzKHJhbmdlLCBSYW5nZSk7XG4gICAgICAgIGNvbnN0IHJldCA9IHdhc20ucmFuZ2VfZG9lc19vdmVybGFwKHRoaXMucHRyLCByYW5nZS5wdHIpO1xuICAgICAgICByZXR1cm4gcmV0ICE9PSAwO1xuICAgIH1cbn1cbi8qKlxuKi9cbmV4cG9ydCBjbGFzcyBSZXBsYWNlbWVudCB7XG5cbiAgICBzdGF0aWMgX193cmFwKHB0cikge1xuICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKFJlcGxhY2VtZW50LnByb3RvdHlwZSk7XG4gICAgICAgIG9iai5wdHIgPSBwdHI7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7XG4gICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyO1xuICAgICAgICB0aGlzLnB0ciA9IDA7XG5cbiAgICAgICAgcmV0dXJuIHB0cjtcbiAgICB9XG5cbiAgICBmcmVlKCkge1xuICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpO1xuICAgICAgICB3YXNtLl9fd2JnX3JlcGxhY2VtZW50X2ZyZWUocHRyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBAcGFyYW0ge1JhbmdlfSBwb3NpdGlvblxuICAgICogQHBhcmFtIHtzdHJpbmd9IHN1YnN0aXR1dGVcbiAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uLCBzdWJzdGl0dXRlKSB7XG4gICAgICAgIF9hc3NlcnRDbGFzcyhwb3NpdGlvbiwgUmFuZ2UpO1xuICAgICAgICB2YXIgcHRyMCA9IHBvc2l0aW9uLnB0cjtcbiAgICAgICAgcG9zaXRpb24ucHRyID0gMDtcbiAgICAgICAgY29uc3QgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKHN1YnN0aXR1dGUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgY29uc3QgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS5yZXBsYWNlbWVudF9uZXcocHRyMCwgcHRyMSwgbGVuMSk7XG4gICAgICAgIHJldHVybiBSZXBsYWNlbWVudC5fX3dyYXAocmV0KTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBAcmV0dXJucyB7UmFuZ2V9XG4gICAgKi9cbiAgICBnZXQgcG9zaXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHdhc20ucmVwbGFjZW1lbnRfcG9zaXRpb24odGhpcy5wdHIpO1xuICAgICAgICByZXR1cm4gUmFuZ2UuX193cmFwKHJldCk7XG4gICAgfVxuICAgIC8qKlxuICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAqL1xuICAgIGdldCBzdWJzdGl0dXRlKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgICAgICB3YXNtLnJlcGxhY2VtZW50X3N1YnN0aXR1dGUocmV0cHRyLCB0aGlzLnB0cik7XG4gICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuKiBBIHNlbGVjdGFibGUgaXRlbVxuKi9cbmV4cG9ydCBjbGFzcyBTZWxlY3Rpb25JdGVtIHtcblxuICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoU2VsZWN0aW9uSXRlbS5wcm90b3R5cGUpO1xuICAgICAgICBvYmoucHRyID0gcHRyO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgX19kZXN0cm95X2ludG9fcmF3KCkge1xuICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjtcbiAgICAgICAgdGhpcy5wdHIgPSAwO1xuXG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgZnJlZSgpIHtcbiAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTtcbiAgICAgICAgd2FzbS5fX3diZ19zZWxlY3Rpb25pdGVtX2ZyZWUocHRyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxuICAgICogQHBhcmFtIHtib29sZWFufSBpc19zZWxlY3RlZFxuICAgICovXG4gICAgY29uc3RydWN0b3IoY29udGVudCwgaXNfc2VsZWN0ZWQpIHtcbiAgICAgICAgY29uc3QgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKGNvbnRlbnQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgY29uc3QgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS5zZWxlY3Rpb25pdGVtX25ldyhwdHIwLCBsZW4wLCBpc19zZWxlY3RlZCk7XG4gICAgICAgIHJldHVybiBTZWxlY3Rpb25JdGVtLl9fd3JhcChyZXQpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgKi9cbiAgICBnZXQgY29udGVudCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpO1xuICAgICAgICAgICAgd2FzbS5zZWxlY3Rpb25pdGVtX2NvbnRlbnQocmV0cHRyLCB0aGlzLnB0cik7XG4gICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICovXG4gICAgZ2V0IGlzX3NlbGVjdGVkKCkge1xuICAgICAgICBjb25zdCByZXQgPSB3YXNtLnNlbGVjdGlvbml0ZW1faXNfc2VsZWN0ZWQodGhpcy5wdHIpO1xuICAgICAgICByZXR1cm4gcmV0ICE9PSAwO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNfc2VsZWN0ZWRcbiAgICAqL1xuICAgIHNldCBpc19zZWxlY3RlZChpc19zZWxlY3RlZCkge1xuICAgICAgICB3YXNtLnNlbGVjdGlvbml0ZW1fc2V0X2lzX3NlbGVjdGVkKHRoaXMucHRyLCBpc19zZWxlY3RlZCk7XG4gICAgfVxufVxuLyoqXG4qL1xuZXhwb3J0IGNsYXNzIFRleHRDb250ZXh0IHtcblxuICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoVGV4dENvbnRleHQucHJvdG90eXBlKTtcbiAgICAgICAgb2JqLnB0ciA9IHB0cjtcblxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHtcbiAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7XG4gICAgICAgIHRoaXMucHRyID0gMDtcblxuICAgICAgICByZXR1cm4gcHRyO1xuICAgIH1cblxuICAgIGZyZWUoKSB7XG4gICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7XG4gICAgICAgIHdhc20uX193YmdfdGV4dGNvbnRleHRfZnJlZShwdHIpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtUZXh0Q29udGV4dFRhaWx9XG4gICAgKi9cbiAgICBnZXQgbGVmdF9jb250ZXh0X3RhaWwoKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHdhc20udGV4dGNvbnRleHRfbGVmdF9jb250ZXh0X3RhaWwodGhpcy5wdHIpO1xuICAgICAgICByZXR1cm4gVGV4dENvbnRleHRUYWlsLl9fd3JhcChyZXQpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtUZXh0Q29udGV4dFRhaWx9XG4gICAgKi9cbiAgICBnZXQgcmlnaHRfY29udGV4dF90YWlsKCkge1xuICAgICAgICBjb25zdCByZXQgPSB3YXNtLnRleHRjb250ZXh0X3JpZ2h0X2NvbnRleHRfdGFpbCh0aGlzLnB0cik7XG4gICAgICAgIHJldHVybiBUZXh0Q29udGV4dFRhaWwuX193cmFwKHJldCk7XG4gICAgfVxuICAgIC8qKlxuICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAqL1xuICAgIGdldCBtYXRjaF90ZXh0KCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7XG4gICAgICAgICAgICB3YXNtLnRleHRjb250ZXh0X21hdGNoX3RleHQocmV0cHRyLCB0aGlzLnB0cik7XG4gICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuKi9cbmV4cG9ydCBjbGFzcyBUZXh0Q29udGV4dFRhaWwge1xuXG4gICAgc3RhdGljIF9fd3JhcChwdHIpIHtcbiAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShUZXh0Q29udGV4dFRhaWwucHJvdG90eXBlKTtcbiAgICAgICAgb2JqLnB0ciA9IHB0cjtcblxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHtcbiAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7XG4gICAgICAgIHRoaXMucHRyID0gMDtcblxuICAgICAgICByZXR1cm4gcHRyO1xuICAgIH1cblxuICAgIGZyZWUoKSB7XG4gICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7XG4gICAgICAgIHdhc20uX193YmdfdGV4dGNvbnRleHR0YWlsX2ZyZWUocHRyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICovXG4gICAgZ2V0IHRleHQoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTtcbiAgICAgICAgICAgIHdhc20udGV4dGNvbnRleHR0YWlsX3RleHQocmV0cHRyLCB0aGlzLnB0cik7XG4gICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07XG4gICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07XG4gICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpO1xuICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtSYW5nZX1cbiAgICAqL1xuICAgIGdldCBwb3NpdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gd2FzbS50ZXh0Y29udGV4dHRhaWxfcG9zaXRpb24odGhpcy5wdHIpO1xuICAgICAgICByZXR1cm4gUmFuZ2UuX193cmFwKHJldCk7XG4gICAgfVxufVxuLyoqXG4qL1xuZXhwb3J0IGNsYXNzIHdiZ19yYXlvbl9Qb29sQnVpbGRlciB7XG5cbiAgICBzdGF0aWMgX193cmFwKHB0cikge1xuICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKHdiZ19yYXlvbl9Qb29sQnVpbGRlci5wcm90b3R5cGUpO1xuICAgICAgICBvYmoucHRyID0gcHRyO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgX19kZXN0cm95X2ludG9fcmF3KCkge1xuICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjtcbiAgICAgICAgdGhpcy5wdHIgPSAwO1xuXG4gICAgICAgIHJldHVybiBwdHI7XG4gICAgfVxuXG4gICAgZnJlZSgpIHtcbiAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTtcbiAgICAgICAgd2FzbS5fX3diZ193YmdfcmF5b25fcG9vbGJ1aWxkZXJfZnJlZShwdHIpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgKi9cbiAgICBudW1UaHJlYWRzKCkge1xuICAgICAgICBjb25zdCByZXQgPSB3YXNtLndiZ19yYXlvbl9wb29sYnVpbGRlcl9udW1UaHJlYWRzKHRoaXMucHRyKTtcbiAgICAgICAgcmV0dXJuIHJldCA+Pj4gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICovXG4gICAgcmVjZWl2ZXIoKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHdhc20ud2JnX3JheW9uX3Bvb2xidWlsZGVyX3JlY2VpdmVyKHRoaXMucHRyKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgLyoqXG4gICAgKi9cbiAgICBidWlsZCgpIHtcbiAgICAgICAgd2FzbS53YmdfcmF5b25fcG9vbGJ1aWxkZXJfYnVpbGQodGhpcy5wdHIpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZChtb2R1bGUsIGltcG9ydHMpIHtcbiAgICBpZiAodHlwZW9mIFJlc3BvbnNlID09PSAnZnVuY3Rpb24nICYmIG1vZHVsZSBpbnN0YW5jZW9mIFJlc3BvbnNlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSAhPSAnYXBwbGljYXRpb24vd2FzbScpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiYFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nYCBmYWlsZWQgYmVjYXVzZSB5b3VyIHNlcnZlciBkb2VzIG5vdCBzZXJ2ZSB3YXNtIHdpdGggYGFwcGxpY2F0aW9uL3dhc21gIE1JTUUgdHlwZS4gRmFsbGluZyBiYWNrIHRvIGBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZWAgd2hpY2ggaXMgc2xvd2VyLiBPcmlnaW5hbCBlcnJvcjpcXG5cIiwgZSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ5dGVzID0gYXdhaXQgbW9kdWxlLmFycmF5QnVmZmVyKCk7XG4gICAgICAgIHJldHVybiBhd2FpdCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZShieXRlcywgaW1wb3J0cyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKG1vZHVsZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgV2ViQXNzZW1ibHkuSW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7IGluc3RhbmNlLCBtb2R1bGUgfTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0KGlucHV0LCBtYXliZV9tZW1vcnkpIHtcbiAgICBpZiAodHlwZW9mIGlucHV0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpbnB1dCA9IG5ldyBVUkwoJ29ic2lkaWFuX3J1c3RfcGx1Z2luX2JnLndhc20nLCBpbXBvcnQubWV0YS51cmwpO1xuICAgIH1cbiAgICBjb25zdCBpbXBvcnRzID0ge307XG4gICAgaW1wb3J0cy53YmcgPSB7fTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX29iamVjdF9kcm9wX3JlZiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgdGFrZU9iamVjdChhcmcwKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fb2JqZWN0X2Nsb25lX3JlZiA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9zdHJpbmdfZ2V0ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCBvYmogPSBnZXRPYmplY3QoYXJnMSk7XG4gICAgICAgIGNvbnN0IHJldCA9IHR5cGVvZihvYmopID09PSAnc3RyaW5nJyA/IG9iaiA6IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIHB0cjAgPSBpc0xpa2VOb25lKHJldCkgPyAwIDogcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7XG4gICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDFdID0gbGVuMDtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9IHB0cjA7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19ub3Rlc2Nhbm5lZGV2ZW50X25ldyA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gTm90ZVNjYW5uZWRFdmVudC5fX3dyYXAoYXJnMCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zZWxlY3Rpb25pdGVtX25ldyA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gU2VsZWN0aW9uSXRlbS5fX3dyYXAoYXJnMCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19ub3RlbWF0Y2hpbmdyZXN1bHRfbmV3ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBOb3RlTWF0Y2hpbmdSZXN1bHQuX193cmFwKGFyZzApO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbG9nXzE0ZmJlMDhkZmY3NmQ0ZmIgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGdldFN0cmluZ0Zyb21XYXNtMChhcmcwLCBhcmcxKSk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19saW5rbWF0Y2hfbmV3ID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBMaW5rTWF0Y2guX193cmFwKGFyZzApO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbGlua3RhcmdldGNhbmRpZGF0ZV9uZXcgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IExpbmtUYXJnZXRDYW5kaWRhdGUuX193cmFwKGFyZzApO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9zdHJpbmdfbmV3ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRTdHJpbmdGcm9tV2FzbTAoYXJnMCwgYXJnMSk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX251bWJlcl9nZXQgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IGdldE9iamVjdChhcmcxKTtcbiAgICAgICAgY29uc3QgcmV0ID0gdHlwZW9mKG9iaikgPT09ICdudW1iZXInID8gb2JqIDogdW5kZWZpbmVkO1xuICAgICAgICBnZXRGbG9hdDY0TWVtb3J5MCgpW2FyZzAgLyA4ICsgMV0gPSBpc0xpa2VOb25lKHJldCkgPyAwIDogcmV0O1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDBdID0gIWlzTGlrZU5vbmUocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2dldF81OTBhMmNkOTEyZjJhZTQ2ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMClbYXJnMSA+Pj4gMF07XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19sZW5ndGhfMmNkNzk4MzI2ZjJjYzRjMSA9IGZ1bmN0aW9uKGFyZzApIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX25ld185NGZiMTI3OWNmNmFmZWE1ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBBcnJheSgpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfZ2V0X2E5Y2FiMTMxZTMxNTJjNDkgPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhhbmRsZUVycm9yKGZ1bmN0aW9uIChhcmcwLCBhcmcxKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IFJlZmxlY3QuZ2V0KGdldE9iamVjdChhcmcwKSwgZ2V0T2JqZWN0KGFyZzEpKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9LCBhcmd1bWVudHMpIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfaXNBcnJheV82NzIxZjJlNTA4OTk2MzQwID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBBcnJheS5pc0FycmF5KGdldE9iamVjdChhcmcwKSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19tYXBfY2JlODFiYzJhYWRlYjVhZSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBzdGF0ZTAgPSB7YTogYXJnMSwgYjogYXJnMn07XG4gICAgICAgICAgICB2YXIgY2IwID0gKGFyZzAsIGFyZzEsIGFyZzIpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gc3RhdGUwLmE7XG4gICAgICAgICAgICAgICAgc3RhdGUwLmEgPSAwO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfX3diZ19hZGFwdGVyXzg2KGEsIHN0YXRlMC5iLCBhcmcwLCBhcmcxLCBhcmcyKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZTAuYSA9IGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5tYXAoY2IwKTtcbiAgICAgICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBzdGF0ZTAuYSA9IHN0YXRlMC5iID0gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfcHVzaF80MGM2YTkwZjE4MDVhYTkwID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkucHVzaChnZXRPYmplY3QoYXJnMSkpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfYXBwbHlfZjJkMGY2NWMyMTllNTU5NCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaGFuZGxlRXJyb3IoZnVuY3Rpb24gKGFyZzAsIGFyZzEsIGFyZzIpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLmFwcGx5KGdldE9iamVjdChhcmcxKSwgZ2V0T2JqZWN0KGFyZzIpKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9LCBhcmd1bWVudHMpIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmFtZV9jYTk3NGY2ZWQyYmU2NjdjID0gZnVuY3Rpb24oYXJnMCkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMCkubmFtZTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2NvbnN0cnVjdG9yXzVhYmQ2ZGZlYThlMGQ0ZWUgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChhcmcwKS5jb25zdHJ1Y3RvcjtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JnX2dldFByb3RvdHlwZU9mXzM0YzkyMjM2NDYxNzcyNTYgPSBmdW5jdGlvbihhcmcwKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihnZXRPYmplY3QoYXJnMCkpO1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfbmV3XzY5MzIxNmUxMDkxNjIzOTYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IEVycm9yKCk7XG4gICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diZ19zdGFja18wZGRhY2E1ZDFhYmZiNTJmID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICBjb25zdCByZXQgPSBnZXRPYmplY3QoYXJnMSkuc3RhY2s7XG4gICAgICAgIGNvbnN0IHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChyZXQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTtcbiAgICAgICAgY29uc3QgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAxXSA9IGxlbjA7XG4gICAgICAgIGdldEludDMyTWVtb3J5MCgpW2FyZzAgLyA0ICsgMF0gPSBwdHIwO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193YmdfZXJyb3JfMDk5MTk2MjdhYzA5OTJmNSA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKGFyZzAsIGFyZzEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2RlYnVnX3N0cmluZyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHtcbiAgICAgICAgY29uc3QgcmV0ID0gZGVidWdTdHJpbmcoZ2V0T2JqZWN0KGFyZzEpKTtcbiAgICAgICAgY29uc3QgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHJldCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpO1xuICAgICAgICBjb25zdCBsZW4wID0gV0FTTV9WRUNUT1JfTEVOO1xuICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDFdID0gbGVuMDtcbiAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9IHB0cjA7XG4gICAgfTtcbiAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX3Rocm93ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpKTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fbW9kdWxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IGluaXQuX193YmluZGdlbl93YXNtX21vZHVsZTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fbWVtb3J5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHdhc20ubWVtb3J5O1xuICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpO1xuICAgIH07XG4gICAgaW1wb3J0cy53YmcuX193Ymdfc3RhcnRXb3JrZXJzXzA0ZjYzZWNhMTk5MTZiOGYgPSBmdW5jdGlvbihhcmcwLCBhcmcxLCBhcmcyKSB7XG4gICAgICAgIGNvbnN0IHJldCA9IHN0YXJ0V29ya2Vycyh0YWtlT2JqZWN0KGFyZzApLCB0YWtlT2JqZWN0KGFyZzEpLCB3YmdfcmF5b25fUG9vbEJ1aWxkZXIuX193cmFwKGFyZzIpKTtcbiAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgfHwgKHR5cGVvZiBSZXF1ZXN0ID09PSAnZnVuY3Rpb24nICYmIGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkgfHwgKHR5cGVvZiBVUkwgPT09ICdmdW5jdGlvbicgJiYgaW5wdXQgaW5zdGFuY2VvZiBVUkwpKSB7XG4gICAgICAgIGlucHV0ID0gZmV0Y2goaW5wdXQpO1xuICAgIH1cblxuICAgIGltcG9ydHMud2JnLm1lbW9yeSA9IG1heWJlX21lbW9yeSB8fCBuZXcgV2ViQXNzZW1ibHkuTWVtb3J5KHtpbml0aWFsOjIzLG1heGltdW06MTYzODQsc2hhcmVkOnRydWV9KTtcblxuICAgIGNvbnN0IHsgaW5zdGFuY2UsIG1vZHVsZSB9ID0gYXdhaXQgbG9hZChhd2FpdCBpbnB1dCwgaW1wb3J0cyk7XG5cbiAgICB3YXNtID0gaW5zdGFuY2UuZXhwb3J0cztcbiAgICBpbml0Ll9fd2JpbmRnZW5fd2FzbV9tb2R1bGUgPSBtb2R1bGU7XG4gICAgd2FzbS5fX3diaW5kZ2VuX3N0YXJ0KCk7XG4gICAgcmV0dXJuIHdhc207XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluaXQ7XG5cbiJdLCJuYW1lcyI6WyJzdGFydFdvcmtlcnMiLCJtb2R1bGUiXSwibWFwcGluZ3MiOiI7O0lBRUEsSUFBSSxJQUFJLENBQUM7QUFDVDtJQUNBLE1BQU0sSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMzQztJQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDeEM7SUFDQSxTQUFTLFNBQVMsQ0FBQyxHQUFHLEVBQUUs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
