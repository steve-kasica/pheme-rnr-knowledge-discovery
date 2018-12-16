// @observablehq/notebook-runtime Copyright 2018 Observable, Inc.
function e(e, t, n) {
  n = n || {};
  var r = e.ownerDocument,
      o = r.defaultView.CustomEvent;
  "function" == typeof o ? o = new o(t, {
    detail: n
  }) : ((o = r.createEvent("Event")).initEvent(t, !1, !1), o.detail = n), e.dispatchEvent(o);
}

function t(e) {
  return Array.isArray(e) || e instanceof Int8Array || e instanceof Int16Array || e instanceof Int32Array || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Uint16Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array;
}

function n(e) {
  return e === (0 | e) + "";
}

function r(e) {
  const t = document.createElement("span");
  return t.className = "observablehq--cellname", t.textContent = `${e} = `, t;
}

const o = Symbol.prototype.toString;

function i(e) {
  return o.call(e);
}

const {
  getOwnPropertySymbols: a,
  prototype: {
    hasOwnProperty: u
  }
} = Object,
      {
  toStringTag: l
} = Symbol,
      s = {},
      c = a;

function d(e, t) {
  return u.call(e, t);
}

function f(e) {
  return e[l] || e.constructor && e.constructor.name || "Object";
}

function p(e, t) {
  try {
    const n = e[t];
    return n && n.constructor, n;
  } catch (e) {
    return s;
  }
}

function h(n, o, i) {
  const a = t(n);
  let u, l, s;
  n instanceof Map ? (u = `Map(${n.size})`, l = m) : n instanceof Set ? (u = `Set(${n.size})`, l = v) : a ? (u = `${n.constructor.name}(${n.length})`, l = b) : (u = f(n), l = w);
  const c = document.createElement("span");
  c.className = "observablehq--expanded", i && c.appendChild(r(i));
  const d = c.appendChild(document.createElement("a"));
  d.innerHTML = "<svg width=8 height=8 class='observablehq--caret'>\n    <path d='M4 7L0 1h8z' fill='currentColor' />\n  </svg>", d.appendChild(document.createTextNode(`${u}${a ? " [" : " {"}`)), d.addEventListener("mouseup", function (e) {
    e.stopPropagation(), B(c, x(n, null, i));
  }), l = l(n);

  for (let e = 0; !(s = l.next()).done && e < 20; ++e) c.appendChild(s.value);

  if (!s.done) {
    const t = c.appendChild(document.createElement("a"));
    t.className = "observablehq--field", t.style.display = "block", t.appendChild(document.createTextNode("  … more")), t.addEventListener("mouseup", function (t) {
      t.stopPropagation(), c.insertBefore(s.value, c.lastChild.previousSibling);

      for (let e = 0; !(s = l.next()).done && e < 19; ++e) c.insertBefore(s.value, c.lastChild.previousSibling);

      s.done && c.removeChild(c.lastChild.previousSibling), e(c, "load");
    });
  }

  return c.appendChild(document.createTextNode(a ? "]" : "}")), c;
}

function* m(e) {
  for (const [t, n] of e) yield g(t, n);

  yield* w(e);
}

function* v(e) {
  for (const t of e) yield y(t);

  yield* w(e);
}

function* b(e) {
  for (let t = 0, n = e.length; t < n; ++t) t in e && (yield _(t, p(e, t), "observablehq--index"));

  for (const t in e) !n(t) && d(e, t) && (yield _(t, p(e, t), "observablehq--key"));

  for (const t of c(e)) yield _(i(t), p(e, t), "observablehq--symbol");
}

function* w(e) {
  for (const t in e) d(e, t) && (yield _(t, p(e, t), "observablehq--key"));

  for (const t of c(e)) yield _(i(t), p(e, t), "observablehq--symbol");
}

function _(e, t, n) {
  const r = document.createElement("div"),
        o = r.appendChild(document.createElement("span"));
  return r.className = "observablehq--field", o.className = n, o.textContent = `  ${e}`, r.appendChild(document.createTextNode(": ")), r.appendChild(W(t)), r;
}

function g(e, t) {
  const n = document.createElement("div");
  return n.className = "observablehq--field", n.appendChild(document.createTextNode("  ")), n.appendChild(W(e)), n.appendChild(document.createTextNode(" => ")), n.appendChild(W(t)), n;
}

function y(e) {
  const t = document.createElement("div");
  return t.className = "observablehq--field", t.appendChild(document.createTextNode("  ")), t.appendChild(W(e)), t;
}

function x(e, n, o) {
  const i = t(e);
  let a, u, l;

  if (e instanceof Map ? (a = `Map(${e.size})`, u = E) : e instanceof Set ? (a = `Set(${e.size})`, u = C) : i ? (a = `${e.constructor.name}(${e.length})`, u = N) : (a = f(e), u = P), n) {
    const t = document.createElement("span");
    return t.className = "observablehq--shallow", o && t.appendChild(r(o)), t.appendChild(document.createTextNode(a)), t.addEventListener("mouseup", function (n) {
      n.stopPropagation(), B(t, x(e));
    }), t;
  }

  const s = document.createElement("span");
  s.className = "observablehq--collapsed", o && s.appendChild(r(o));
  const c = s.appendChild(document.createElement("a"));
  c.innerHTML = "<svg width=8 height=8 class='observablehq--caret'>\n    <path d='M7 4L1 8V0z' fill='currentColor' />\n  </svg>", c.appendChild(document.createTextNode(`${a}${i ? " [" : " {"}`)), s.addEventListener("mouseup", function (t) {
    t.stopPropagation(), B(s, h(e, 0, o));
  }, !0), u = u(e);

  for (let e = 0; !(l = u.next()).done && e < 20; ++e) e > 0 && s.appendChild(document.createTextNode(", ")), s.appendChild(l.value);

  return l.done || s.appendChild(document.createTextNode(", …")), s.appendChild(document.createTextNode(i ? "]" : "}")), s;
}

function* E(e) {
  for (const [t, n] of e) yield k(t, n);

  yield* P(e);
}

function* C(e) {
  for (const t of e) yield W(t, !0);

  yield* P(e);
}

function* N(e) {
  for (let t = -1, n = 0, r = e.length; n < r; ++n) if (n in e) {
    let r = n - t - 1;

    if (r > 0) {
      const e = document.createElement("span");
      e.className = "observablehq--empty", e.textContent = 1 === r ? "empty" : `empty × ${n - t - 1}`, yield e;
    }

    yield W(p(e, n), !0), t = n;
  }

  for (const t in e) !n(t) && d(e, t) && (yield S(t, p(e, t), "observablehq--key"));

  for (const t of c(e)) yield S(i(t), p(e, t), "observablehq--symbol");
}

function* P(e) {
  for (const t in e) d(e, t) && (yield S(t, p(e, t), "observablehq--key"));

  for (const t of c(e)) yield S(i(t), p(e, t), "observablehq--symbol");
}

function S(e, t, n) {
  const r = document.createDocumentFragment(),
        o = r.appendChild(document.createElement("span"));
  return o.className = n, o.textContent = e, r.appendChild(document.createTextNode(": ")), r.appendChild(W(t, !0)), r;
}

function k(e, t) {
  const n = document.createDocumentFragment();
  return n.appendChild(W(e, !0)), n.appendChild(document.createTextNode(" => ")), n.appendChild(W(t, !0)), n;
}

function q(e, t) {
  var n = e + "",
      r = n.length;
  return r < t ? new Array(t - r + 1).join(0) + n : n;
}

var j = Error.prototype.toString;
var L = RegExp.prototype.toString;
const $ = 20;

function M(e) {
  return e.replace(/[\\`\x00-\x09\x0b-\x19]|\${/g, O);
}

function O(e) {
  var t = e.charCodeAt(0);
  return t < 16 ? "\\x0" + t.toString(16) : t < 32 ? "\\x" + t.toString(16) : "\\" + e;
}

function A(e, t) {
  for (var n = 0; t.exec(e);) ++n;

  return n;
}

var T = Function.prototype.toString,
    R = {
  prefix: "async ƒ"
},
    D = {
  prefix: "async ƒ*"
},
    F = {
  prefix: "class"
},
    U = {
  prefix: "ƒ"
},
    z = {
  prefix: "ƒ*"
};

function H(e, t, n) {
  var o = document.createElement("span");
  o.className = "observablehq--function", n && o.appendChild(r(n));
  var i = o.appendChild(document.createElement("span"));
  return i.className = "observablehq--keyword", i.textContent = e.prefix, o.appendChild(document.createTextNode(t)), o;
}

const {
  prototype: {
    toString: I
  }
} = Object;

function W(e, t, n, o) {
  let a = typeof e;

  switch (a) {
    case "boolean":
    case "undefined":
      e += "";
      break;

    case "number":
      e = 0 === e && 1 / e < 0 ? "-0" : e + "";
      break;

    case "bigint":
      e += "n";
      break;

    case "symbol":
      e = i(e);
      break;

    case "function":
      return function (e, t) {
        var n,
            r,
            o = T.call(e);

        switch (e.constructor && e.constructor.name) {
          case "AsyncFunction":
            n = R;
            break;

          case "AsyncGeneratorFunction":
            n = D;
            break;

          case "GeneratorFunction":
            n = z;
            break;

          default:
            n = /^class\b/.test(o) ? F : U;
        }

        return n === F ? H(n, "", t) : (r = /^(?:async\s*)?(\w+)\s*=>/.exec(o)) ? H(n, "(" + r[1] + ")", t) : (r = /^(?:async\s*)?\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(o)) ? H(n, r[1] ? "(" + r[1].replace(/\s*,\s*/g, ", ") + ")" : "()", t) : (r = /^(?:async\s*)?function(?:\s*\*)?(?:\s*\w+)?\s*\(\s*(\w+(?:\s*,\s*\w+)*)?\s*\)/.exec(o)) ? H(n, r[1] ? "(" + r[1].replace(/\s*,\s*/g, ", ") + ")" : "()", t) : H(n, "(…)", t);
      }(e, o);

    case "string":
      return function (e, t, n, o) {
        if (!1 === t) {
          if (A(e, /["\n]/g) <= A(e, /`|\${/g)) {
            const t = document.createElement("span");
            o && t.appendChild(r(o));
            const n = t.appendChild(document.createElement("span"));
            return n.className = "observablehq--string", n.textContent = JSON.stringify(e), t;
          }

          const i = e.split("\n");

          if (i.length > $ && !n) {
            const n = document.createElement("div");
            o && n.appendChild(r(o));
            const a = n.appendChild(document.createElement("span"));
            a.className = "observablehq--string", a.textContent = "`" + M(i.slice(0, $).join("\n"));
            const u = n.appendChild(document.createElement("span")),
                  l = i.length - $;
            return u.textContent = `Show ${l} truncated line${l > 1 ? "s" : ""}`, u.className = "observablehq--string-expand", u.addEventListener("mouseup", function (r) {
              r.stopPropagation(), B(n, W(e, t, !0, o));
            }), n;
          }

          const a = document.createElement("span");
          o && a.appendChild(r(o));
          const u = a.appendChild(document.createElement("span"));
          return u.className = `observablehq--string${n ? " observablehq--expanded" : ""}`, u.textContent = "`" + M(e) + "`", a;
        }

        const i = document.createElement("span");
        o && i.appendChild(r(o));
        const a = i.appendChild(document.createElement("span"));
        return a.className = "observablehq--string", a.textContent = JSON.stringify(e.length > 100 ? `${e.slice(0, 50)}…${e.slice(-49)}` : e), i;
      }(e, t, n, o);

    default:
      if (null === e) {
        a = null, e = "null";
        break;
      }

      if (e instanceof Date) {
        a = "date", e = function (e) {
          return isNaN(e) ? "Invalid Date" : q(e.getFullYear(), 4) + "-" + q(e.getMonth() + 1, 2) + "-" + q(e.getDate(), 2) + (e.getMilliseconds() ? "T" + q(e.getHours(), 2) + ":" + q(e.getMinutes(), 2) + ":" + q(e.getSeconds(), 2) + "." + q(e.getMilliseconds(), 3) : e.getSeconds() ? "T" + q(e.getHours(), 2) + ":" + q(e.getMinutes(), 2) + ":" + q(e.getSeconds(), 2) : e.getMinutes() || e.getHours() ? "T" + q(e.getHours(), 2) + ":" + q(e.getMinutes(), 2) : "");
        }(e);
        break;
      }

      if (e === s) {
        a = "forbidden", e = "[forbidden]";
        break;
      }

      switch (I.call(e)) {
        case "[object RegExp]":
          a = "regexp", e = function (e) {
            return L.call(e);
          }(e);
          break;

        case "[object Error]":
        case "[object DOMException]":
          a = "error", e = function (e) {
            return e.stack || j.call(e);
          }(e);
          break;

        default:
          return (n ? h : x)(e, t, o);
      }

  }

  const u = document.createElement("span");
  o && u.appendChild(r(o));
  const l = u.appendChild(document.createElement("span"));
  return l.className = `observablehq--${a}`, l.textContent = e, u;
}

function B(t, n) {
  t.classList.contains("observablehq--inspect") && n.classList.add("observablehq--inspect"), t.parentNode.replaceChild(n, t), e(n, "load");
}

const V = /\s+\(\d+:\d+\)$/m;

class G {
  constructor(e) {
    if (!e) throw new Error("invalid node");
    this._node = e, e.classList.add("observablehq");
  }

  pending() {
    const {
      _node: e
    } = this;
    e.classList.remove("observablehq--error"), e.classList.add("observablehq--running");
  }

  fulfilled(t, n) {
    const {
      _node: r
    } = this;
    if ((!(t instanceof Element || t instanceof Text) || t.parentNode && t.parentNode !== r) && (t = W(t, !1, r.firstChild && r.firstChild.classList && r.firstChild.classList.contains("observablehq--expanded"), n)).classList.add("observablehq--inspect"), r.classList.remove("observablehq--running", "observablehq--error"), r.firstChild !== t) if (r.firstChild) {
      for (; r.lastChild !== r.firstChild;) r.removeChild(r.lastChild);

      r.replaceChild(t, r.firstChild);
    } else r.appendChild(t);
    e(r, "update");
  }

  rejected(t, n) {
    const {
      _node: o
    } = this;

    for (o.classList.remove("observablehq--running"), o.classList.add("observablehq--error"); o.lastChild;) o.removeChild(o.lastChild);

    var i = document.createElement("div");
    i.className = "observablehq--inspect", n && i.appendChild(r(n)), i.appendChild(document.createTextNode((t + "").replace(V, ""))), o.appendChild(i), e(o, "error", {
      error: t
    });
  }

}

function J(e) {
  return function () {
    return e;
  };
}

G.into = function (e) {
  if ("string" == typeof e && null == (e = document.querySelector(e))) throw new Error("container not found");
  return function () {
    return new G(e.appendChild(document.createElement("div")));
  };
};

var X = {
  math: "http://www.w3.org/1998/Math/MathML",
  svg: "http://www.w3.org/2000/svg",
  xhtml: "http://www.w3.org/1999/xhtml",
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
},
    Y = 0;

function K(e) {
  this.id = e, this.href = window.location.href + "#" + e;
}

K.prototype.toString = function () {
  return "url(" + this.href + ")";
};

var Q = {
  canvas: function (e, t) {
    var n = document.createElement("canvas");
    return n.width = e, n.height = t, n;
  },
  context2d: function (e, t, n) {
    null == n && (n = devicePixelRatio);
    var r = document.createElement("canvas");
    r.width = e * n, r.height = t * n, r.style.width = e + "px";
    var o = r.getContext("2d");
    return o.scale(n, n), o;
  },
  download: function (e, t, n) {
    var r = document.createElement("a");
    return r.appendChild(document.createElement("button")).textContent = null == n ? "Download" : n, r.download = null == t ? "untitled" : t, r.onclick = function () {
      var t = r.href = URL.createObjectURL(e);
      setTimeout(function () {
        URL.revokeObjectURL(t);
      }, 50);
    }, r;
  },
  element: function (e, t) {
    var n,
        r = e += "",
        o = r.indexOf(":");
    o >= 0 && "xmlns" !== (r = e.slice(0, o)) && (e = e.slice(o + 1));
    var i = X.hasOwnProperty(r) ? document.createElementNS(X[r], e) : document.createElement(e);
    if (t) for (var a in t) o = (r = a).indexOf(":"), n = t[a], o >= 0 && "xmlns" !== (r = a.slice(0, o)) && (a = a.slice(o + 1)), X.hasOwnProperty(r) ? i.setAttributeNS(X[r], a, n) : i.setAttribute(a, n);
    return i;
  },
  input: function (e) {
    var t = document.createElement("input");
    return null != e && (t.type = e), t;
  },
  range: function (e, t, n) {
    1 === arguments.length && (t = e, e = null);
    var r = document.createElement("input");
    return r.min = e = null == e ? 0 : +e, r.max = t = null == t ? 1 : +t, r.step = null == n ? "any" : n = +n, r.type = "range", r;
  },
  select: function (e) {
    var t = document.createElement("select");
    return Array.prototype.forEach.call(e, function (e) {
      var n = document.createElement("option");
      n.value = n.textContent = e, t.appendChild(n);
    }), t;
  },
  svg: function (e, t) {
    var n = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    return n.setAttribute("viewBox", [0, 0, e, t]), n.setAttribute("width", e), n.setAttribute("height", t), n;
  },
  text: function (e) {
    return document.createTextNode(e);
  },
  uid: function (e) {
    return new K("O-" + (null == e ? "" : e + "-") + ++Y);
  }
},
    Z = {
  buffer: function (e) {
    return new Promise(function (t, n) {
      var r = new FileReader();
      r.onload = function () {
        t(r.result);
      }, r.onerror = n, r.readAsArrayBuffer(e);
    });
  },
  text: function (e) {
    return new Promise(function (t, n) {
      var r = new FileReader();
      r.onload = function () {
        t(r.result);
      }, r.onerror = n, r.readAsText(e);
    });
  },
  url: function (e) {
    return new Promise(function (t, n) {
      var r = new FileReader();
      r.onload = function () {
        t(r.result);
      }, r.onerror = n, r.readAsDataURL(e);
    });
  }
};

function ee() {
  return this;
}

function te(e, t) {
  let n = !1;
  return {
    [Symbol.iterator]: ee,
    next: () => n ? {
      done: !0
    } : (n = !0, {
      done: !1,
      value: e
    }),
    return: () => (n = !0, t(e), {
      done: !0
    }),
    throw: () => ({
      done: n = !0
    })
  };
}

function ne(e) {
  let t,
      n,
      r = !1;
  const o = e(function (e) {
    return n ? (n(e), n = null) : r = !0, t = e;
  });
  return {
    [Symbol.iterator]: ee,
    throw: () => ({
      done: !0
    }),
    return: () => (null != o && o(), {
      done: !0
    }),
    next: function () {
      return {
        done: !1,
        value: r ? (r = !1, Promise.resolve(t)) : new Promise(e => n = e)
      };
    }
  };
}

function re(e) {
  switch (e.type) {
    case "range":
    case "number":
      return e.valueAsNumber;

    case "date":
      return e.valueAsDate;

    case "checkbox":
      return e.checked;

    case "file":
      return e.multiple ? e.files : e.files[0];

    default:
      return e.value;
  }
}

var oe = {
  disposable: te,
  filter: function* (e, t) {
    for (var n, r = -1; !(n = e.next()).done;) t(n.value, ++r) && (yield n.value);
  },
  input: function (e) {
    return ne(function (t) {
      var n = function (e) {
        switch (e.type) {
          case "button":
          case "submit":
          case "checkbox":
            return "click";

          case "file":
            return "change";

          default:
            return "input";
        }
      }(e),
          r = re(e);

      function o() {
        t(re(e));
      }

      return e.addEventListener(n, o), void 0 !== r && t(r), function () {
        e.removeEventListener(n, o);
      };
    });
  },
  map: function* (e, t) {
    for (var n, r = -1; !(n = e.next()).done;) yield t(n.value, ++r);
  },
  observe: ne,
  queue: function (e) {
    let t;
    const n = [],
          r = e(function (e) {
      return n.push(e), t && (t(n.shift()), t = null), e;
    });
    return {
      [Symbol.iterator]: ee,
      throw: () => ({
        done: !0
      }),
      return: () => (null != r && r(), {
        done: !0
      }),
      next: function () {
        return {
          done: !1,
          value: n.length ? Promise.resolve(n.shift()) : new Promise(e => t = e)
        };
      }
    };
  },
  range: function* (e, t, n) {
    e = +e, t = +t, n = (o = arguments.length) < 2 ? (t = e, e = 0, 1) : o < 3 ? 1 : +n;

    for (var r = -1, o = 0 | Math.max(0, Math.ceil((t - e) / n)); ++r < o;) yield e + r * n;
  },
  valueAt: function (e, t) {
    if (!(!isFinite(t = +t) || t < 0 || t != t | 0)) for (var n, r = -1; !(n = e.next()).done;) if (++r === t) return n.value;
  },
  worker: function (e) {
    const t = URL.createObjectURL(new Blob([e], {
      type: "text/javascript"
    })),
          n = new Worker(t);
    return te(n, () => {
      n.terminate(), URL.revokeObjectURL(t);
    });
  }
};

function ie(e, t) {
  return function (n) {
    var r,
        o,
        i,
        a,
        u,
        l,
        s,
        c,
        d = n[0],
        f = [],
        p = null,
        h = -1;

    for (u = 1, l = arguments.length; u < l; ++u) {
      if ((r = arguments[u]) instanceof Node) f[++h] = r, d += "\x3c!--o:" + h + "--\x3e";else if (Array.isArray(r)) {
        for (s = 0, c = r.length; s < c; ++s) (o = r[s]) instanceof Node ? (null === p && (f[++h] = p = document.createDocumentFragment(), d += "\x3c!--o:" + h + "--\x3e"), p.appendChild(o)) : (p = null, d += o);

        p = null;
      } else d += r;
      d += n[u];
    }

    if (p = e(d), ++h > 0) {
      for (i = new Array(h), a = document.createTreeWalker(p, NodeFilter.SHOW_COMMENT, null, !1); a.nextNode();) o = a.currentNode, /^o:/.test(o.nodeValue) && (i[+o.nodeValue.slice(2)] = o);

      for (u = 0; u < h; ++u) (o = i[u]) && o.parentNode.replaceChild(f[u], o);
    }

    return 1 === p.childNodes.length ? p.removeChild(p.firstChild) : 11 === p.nodeType ? ((o = t()).appendChild(p), o) : p;
  };
}

var ae = ie(function (e) {
  var t = document.createElement("template");
  return t.innerHTML = e.trim(), document.importNode(t.content, !0);
}, function () {
  return document.createElement("div");
});

function ue(e) {
  let t;
  Object.defineProperties(this, {
    generator: {
      value: ne(e => void (t = e))
    },
    value: {
      get: () => e,
      set: n => t(e = n)
    }
  }), void 0 !== e && t(e);
}

function* le() {
  for (;;) yield Date.now();
}

var se = new Map();

function ce(e, t) {
  var n;
  return (n = se.get(e = +e)) ? n.then(J(t)) : (n = Date.now()) >= e ? Promise.resolve(t) : function (e, t) {
    var n = new Promise(function (n) {
      se.delete(t);
      var r = t - e;
      if (!(r > 0)) throw new Error("invalid time");
      if (r > 2147483647) throw new Error("too long to wait");
      setTimeout(n, r);
    });
    return se.set(t, n), n;
  }(n, e).then(J(t));
}

var de = {
  delay: function (e, t) {
    return new Promise(function (n) {
      setTimeout(function () {
        n(t);
      }, e);
    });
  },
  tick: function (e, t) {
    return ce(Math.ceil((Date.now() + 1) / e) * e, t);
  },
  when: ce
};

function fe(e, t) {
  if (/^(\w+:)|\/\//i.test(e)) return e;
  if (/^[.]{0,2}\//i.test(e)) return new URL(e, null == t ? location : t).href;
  if (!e.length || /^[\s._]/.test(e) || /\s$/.test(e)) throw new Error("illegal name");
  return "https://unpkg.com/" + e;
}

const pe = new Map(),
      he = [],
      me = he.map,
      ve = he.some,
      be = he.hasOwnProperty,
      we = "https://unpkg.com/",
      _e = /^((?:@[^\/@]+\/)?[^\/@]+)(?:@([^\/]+))?(?:\/(.*))?$/,
      ge = /^\d+\.\d+\.\d+(-[\w-.+]+)?$/;

function ye(e) {
  return "string" == typeof e ? e : "";
}

function xe(e) {
  const t = _e.exec(e);

  return t && {
    name: t[1],
    version: t[2],
    path: t[3]
  };
}

function Ee(e) {
  const t = `${we}${e.name}${e.version ? `@${e.version}` : ""}/package.json`;
  let n = pe.get(t);
  return n || pe.set(t, n = fetch(t).then(e => {
    if (!e.ok) throw new Error("unable to load package.json");
    return e.redirected && !pe.has(e.url) && pe.set(e.url, n), e.json();
  })), n;
}

const Ce = Ne(async function (e, t) {
  if (e.startsWith(we) && (e = e.substring(we.length)), /^(\w+:)|\/\//i.test(e)) return e;
  if (/^[.]{0,2}\//i.test(e)) return new URL(e, null == t ? location : t).href;
  if (!e.length || /^[\s._]/.test(e) || /\s$/.test(e)) throw new Error("illegal name");
  const n = xe(e);
  if (!n) return `${we}${e}`;

  if (!n.version && null != t && t.startsWith(we)) {
    const e = await Ee(xe(t.substring(we.length)));
    n.version = e.dependencies && e.dependencies[n.name] || e.peerDependencies && e.peerDependencies[n.name];
  }

  if (n.path && n.version && ge.test(n.version)) return `${we}${n.name}@${n.version}/${n.path}`;
  const r = await Ee(n);
  return `${we}${r.name}@${r.version}/${n.path || ye(r.unpkg) || ye(r.browser) || ye(r.main) || "index.js"}`;
});

function Ne(e) {
  const t = new Map(),
        n = o(null);

  function r(e) {
    if ("string" != typeof e) return e;
    let n = t.get(e);
    return n || t.set(e, n = new Promise((t, n) => {
      const r = document.createElement("script");
      r.onload = () => {
        try {
          t(he.pop()(o(e)));
        } catch (e) {
          n(new Error("invalid module"));
        }

        r.remove();
      }, r.onerror = () => {
        n(new Error("unable to load module")), r.remove();
      }, r.async = !0, r.src = e, window.define = qe, document.head.appendChild(r);
    })), n;
  }

  function o(t) {
    return n => Promise.resolve(e(n, t)).then(r);
  }

  function i(e) {
    return arguments.length > 1 ? Promise.all(me.call(arguments, n)).then(Pe) : n(e);
  }

  return i.alias = function (t) {
    return Ne((n, r) => n in t && (r = null, "string" != typeof (n = t[n])) ? n : e(n, r));
  }, i.resolve = e, i;
}

function Pe(e) {
  const t = {};

  for (const n of e) for (const e in n) be.call(n, e) && (null == n[e] ? Object.defineProperty(t, e, {
    get: Se(n, e)
  }) : t[e] = n[e]);

  return t;
}

function Se(e, t) {
  return () => e[t];
}

function ke(e) {
  return e + "" == "exports";
}

function qe(e, t, n) {
  const r = arguments.length;
  r < 2 ? (n = e, t = []) : r < 3 && (n = t, t = "string" == typeof e ? [] : e), he.push(ve.call(t, ke) ? e => {
    const r = {};
    return Promise.all(me.call(t, t => ke(t += "") ? r : e(t))).then(e => (n.apply(null, e), r));
  } : e => Promise.all(me.call(t, e)).then(e => "function" == typeof n ? n.apply(null, e) : n));
}

qe.amd = {};
var je = ie(function (e) {
  var t = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return t.innerHTML = e.trim(), t;
}, function () {
  return document.createElementNS("http://www.w3.org/2000/svg", "g");
}),
    Le = String.raw;

function $e(e) {
  return new Promise(function (t, n) {
    var r = document.createElement("link");
    r.rel = "stylesheet", r.href = e, r.onerror = n, r.onload = t, document.head.appendChild(r);
  });
}

var Me = 28;

function Oe() {
  return ne(function (e) {
    var t = e(window.innerWidth - Me);

    function n() {
      var n = window.innerWidth - Me;
      n !== t && e(t = n);
    }

    return window.addEventListener("resize", n), function () {
      window.removeEventListener("resize", n);
    };
  });
}

function Ae(e) {
  const t = function (e) {
    return null == e ? Ce : Ne(e);
  }(e);

  Object.defineProperties(this, {
    DOM: {
      value: Q,
      writable: !0,
      enumerable: !0
    },
    Files: {
      value: Z,
      writable: !0,
      enumerable: !0
    },
    Generators: {
      value: oe,
      writable: !0,
      enumerable: !0
    },
    html: {
      value: J(ae),
      writable: !0,
      enumerable: !0
    },
    md: {
      value: function (e) {
        return function () {
          return e("marked@0.3.12/marked.min.js").then(function (t) {
            return ie(function (n) {
              var r = document.createElement("div");
              r.innerHTML = t(n, {
                langPrefix: ""
              }).trim();
              var o = r.querySelectorAll("pre code[class]");
              return o.length > 0 && e("@observablehq/highlight.js@1.1.1/highlight.min.js").then(function (e) {
                o.forEach(function (t) {
                  e.highlightBlock(t), t.parentNode.classList.add("observablehq--md-pre");
                });
              }), r;
            }, function () {
              return document.createElement("div");
            });
          });
        };
      }(t),
      writable: !0,
      enumerable: !0
    },
    Mutable: {
      value: J(ue),
      writable: !0,
      enumerable: !0
    },
    now: {
      value: le,
      writable: !0,
      enumerable: !0
    },
    Promises: {
      value: de,
      writable: !0,
      enumerable: !0
    },
    require: {
      value: J(t),
      writable: !0,
      enumerable: !0
    },
    resolve: {
      value: J(fe),
      writable: !0,
      enumerable: !0
    },
    svg: {
      value: J(je),
      writable: !0,
      enumerable: !0
    },
    tex: {
      value: function (e) {
        return function () {
          return Promise.all([e("@observablehq/katex@0.10.1/dist/katex.min.js"), e.resolve("@observablehq/katex@0.10.1/dist/katex.min.css").then($e)]).then(function (e) {
            var t = e[0],
                n = r();

            function r(e) {
              return function () {
                var n = document.createElement("div");
                return t.render(Le.apply(String, arguments), n, e), n.removeChild(n.firstChild);
              };
            }

            return n.options = r, n.block = r({
              displayMode: !0
            }), n;
          });
        };
      }(t),
      writable: !0,
      enumerable: !0
    },
    width: {
      value: Oe,
      writable: !0,
      enumerable: !0
    }
  });
}

function Te(e, t) {
  this.message = e + "", this.input = t;
}

Te.prototype = Object.create(Error.prototype), Te.prototype.name = "RuntimeError", Te.prototype.constructor = Te;
var Re = Array.prototype,
    De = Re.map,
    Fe = Re.forEach;

function Ue(e) {
  return function () {
    return e;
  };
}

function ze(e) {
  return e;
}

function He() {}

var Ie = 1,
    We = 2,
    Be = 3,
    Ve = {};

function Ge(e, t, n) {
  var r;
  null == n && (n = Ve), Object.defineProperties(this, {
    _observer: {
      value: n,
      writable: !0
    },
    _definition: {
      value: Ye,
      writable: !0
    },
    _duplicate: {
      value: void 0,
      writable: !0
    },
    _duplicates: {
      value: void 0,
      writable: !0
    },
    _indegree: {
      value: -1,
      writable: !0
    },
    _inputs: {
      value: [],
      writable: !0
    },
    _invalidate: {
      value: He,
      writable: !0
    },
    _module: {
      value: t
    },
    _name: {
      value: null,
      writable: !0
    },
    _outputs: {
      value: new Set(),
      writable: !0
    },
    _promise: {
      value: Promise.resolve(void 0),
      writable: !0
    },
    _reachable: {
      value: n !== Ve,
      writable: !0
    },
    _rejector: {
      value: (r = this, function (e) {
        if (e === Ye) throw new Te(r._name + " is not defined", r._name);
        throw new Te(r._name + " could not be resolved", r._name);
      })
    },
    _type: {
      value: e
    },
    _value: {
      value: void 0,
      writable: !0
    },
    _version: {
      value: 0,
      writable: !0
    }
  });
}

function Je(e) {
  e._module._runtime._dirty.add(e), e._outputs.add(this);
}

function Xe(e) {
  e._module._runtime._dirty.add(e), e._outputs.delete(this);
}

function Ye() {
  throw Ye;
}

function Ke(e) {
  return function () {
    throw new Te(e + " is defined more than once");
  };
}

function Qe(e, t, n) {
  var r = this._module._scope,
      o = this._module._runtime;
  if (this._inputs.forEach(Xe, this), t.forEach(Je, this), this._inputs = t, this._definition = n, this._value = void 0, e == this._name && r.get(e) === this) this._outputs.forEach(o._updates.add, o._updates);else {
    var i, a;
    if (this._name) if (this._outputs.size) r.delete(this._name), (a = this._module._resolve(this._name))._outputs = this._outputs, this._outputs = new Set(), a._outputs.forEach(function (e) {
      e._inputs[e._inputs.indexOf(this)] = a;
    }, this), a._outputs.forEach(o._updates.add, o._updates), o._dirty.add(a).add(this), r.set(this._name, a);else if ((a = r.get(this._name)) === this) r.delete(this._name);else {
      if (a._type !== Be) throw new Error();
      a._duplicates.delete(this), this._duplicate = void 0, 1 === a._duplicates.size && (a = a._duplicates.keys().next().value, i = r.get(this._name), a._outputs = i._outputs, i._outputs = new Set(), a._outputs.forEach(function (e) {
        e._inputs[e._inputs.indexOf(i)] = a;
      }), a._definition = a._duplicate, a._duplicate = void 0, o._dirty.add(i).add(a), o._updates.add(a), r.set(this._name, a));
    }
    if (this._outputs.size) throw new Error();
    e && ((a = r.get(e)) ? a._type === Be ? (this._definition = Ke(e), this._duplicate = n, a._duplicates.add(this)) : a._type === We ? (this._outputs = a._outputs, a._outputs = new Set(), this._outputs.forEach(function (e) {
      e._inputs[e._inputs.indexOf(a)] = this;
    }, this), o._dirty.add(a).add(this), r.set(e, this)) : (a._duplicate = a._definition, this._duplicate = n, (i = new Ge(Be, this._module))._name = e, i._definition = this._definition = a._definition = Ke(e), i._outputs = a._outputs, a._outputs = new Set(), i._outputs.forEach(function (e) {
      e._inputs[e._inputs.indexOf(a)] = i;
    }), i._duplicates = new Set([this, a]), o._dirty.add(a).add(i), o._updates.add(a).add(i), r.set(e, i)) : r.set(e, this)), this._name = e;
  }
  return o._updates.add(this), o._compute(), this;
}

Object.defineProperties(Ge.prototype, {
  _pending: {
    value: function () {
      this._observer.pending && this._observer.pending();
    },
    writable: !0,
    configurable: !0
  },
  _fulfilled: {
    value: function (e) {
      this._observer.fulfilled && this._observer.fulfilled(e, this._name);
    },
    writable: !0,
    configurable: !0
  },
  _rejected: {
    value: function (e) {
      this._observer.rejected && this._observer.rejected(e, this._name);
    },
    writable: !0,
    configurable: !0
  },
  define: {
    value: function (e, t, n) {
      switch (arguments.length) {
        case 1:
          n = e, e = t = null;
          break;

        case 2:
          n = t, "string" == typeof e ? t = null : (t = e, e = null);
      }

      return Qe.call(this, null == e ? null : e + "", null == t ? [] : De.call(t, this._module._resolve, this._module), "function" == typeof n ? n : Ue(n));
    },
    writable: !0,
    configurable: !0
  },
  delete: {
    value: function () {
      return Qe.call(this, null, [], He);
    },
    writable: !0,
    configurable: !0
  },
  import: {
    value: function (e, t, n) {
      arguments.length < 3 && (n = t, t = e);
      return Qe.call(this, t + "", [n._resolve(e + "")], ze);
    },
    writable: !0,
    configurable: !0
  }
});
var Ze = new Map();

function et(e) {
  Object.defineProperties(this, {
    _runtime: {
      value: e
    },
    _scope: {
      value: new Map()
    }
  });
}

function tt(e) {
  return e._name;
}

Object.defineProperties(et.prototype, {
  _copy: {
    value: function (e, t, n) {
      var r = new et(this._runtime);
      return n.set(this, r), this._scope.forEach(function (o, i) {
        var a,
            u = new Ge(o._type, r);
        if (a = e.get(i)) u.import(a.name, a.alias, t);else if (o._definition === ze) {
          var l = o._inputs[0],
              s = l._module,
              c = n.get(s) || s._copy(Ze, null, n);

          u.import(l._name, i, c);
        } else u.define(i, o._inputs.map(tt), o._definition);
      }), r;
    },
    writable: !0,
    configurable: !0
  },
  _resolve: {
    value: function (e) {
      var t,
          n = this._scope.get(e);

      n || (n = new Ge(We, this), this._runtime._builtin._scope.has(e) ? n.import(e, this._runtime._builtin) : void 0 !== (t = this._runtime._global(e)) ? n.define(e, Ue(t)) : "invalidation" === e ? n.define(e, nt) : "visibility" === e ? n.define(e, rt) : this._scope.set(n._name = e, n));
      return n;
    },
    writable: !0,
    configurable: !0
  },
  define: {
    value: function () {
      var e = new Ge(Ie, this);
      return e.define.apply(e, arguments);
    },
    writable: !0,
    configurable: !0
  },
  derive: {
    value: function (e, t) {
      var n = new Map();
      return Fe.call(e, function (e) {
        "object" != typeof e && (e = {
          name: e + ""
        }), null == e.alias && (e.alias = e.name), n.set(e.alias, e);
      }), this._copy(n, t, new Map());
    },
    writable: !0,
    configurable: !0
  },
  import: {
    value: function () {
      var e = new Ge(Ie, this);
      return e.import.apply(e, arguments);
    },
    writable: !0,
    configurable: !0
  },
  variable: {
    value: function (e) {
      return new Ge(Ie, this, e);
    },
    writable: !0,
    configurable: !0
  }
});
var nt = {},
    rt = {};

function ot(e, t = function (e) {
  return window[e];
}) {
  var n = this.module();
  if (Object.defineProperties(this, {
    _dirty: {
      value: new Set()
    },
    _updates: {
      value: new Set()
    },
    _computing: {
      value: null,
      writable: !0
    },
    _builtin: {
      value: n
    },
    _global: {
      value: t
    }
  }), e) for (var r in e) new Ge(We, n).define(r, [], e[r]);
}

function it(e) {
  ++e._indegree;
}

function at(e) {
  return e._promise.catch(e._rejector);
}

function ut(e) {
  return new Promise(function (t) {
    e._invalidate = t;
  });
}

function lt(e, t) {
  let n,
      r,
      o = "function" == typeof IntersectionObserver && t._observer && t._observer._node,
      i = !o,
      a = He,
      u = He;
  return o && ((r = new IntersectionObserver(([e]) => (i = e.isIntersecting) && (n = null, a()))).observe(o), e.then(() => (r.disconnect(), r = null, u()))), function (e) {
    return i ? Promise.resolve(e) : r ? (n || (n = new Promise((e, t) => (a = e, u = t))), n.then(() => e)) : Promise.reject();
  };
}

function st(e) {
  e._invalidate(), e._invalidate = He, e._pending();
  var t = e._value,
      n = ++e._version,
      r = null,
      o = e._promise = Promise.all(e._inputs.map(at)).then(function (o) {
    if (e._version === n) {
      for (var i = 0, a = o.length; i < a; ++i) switch (o[i]) {
        case nt:
          o[i] = r = ut(e);
          break;

        case rt:
          r || (r = ut(e)), o[i] = lt(r, e);
      }

      return e._definition.apply(t, o);
    }
  }).then(function (t) {
    return function (e) {
      return e && "function" == typeof e.next && "function" == typeof e.return;
    }(t) ? ((r || ut(e)).then((i = t, function () {
      i.return();
    })), function (e, t, n, r) {
      function o() {
        var n = new Promise(function (e) {
          e(r.next());
        }).then(function (r) {
          return r.done ? void 0 : Promise.resolve(r.value).then(function (r) {
            if (e._version === t) return ct(e, r, n).then(o), e._fulfilled(r), r;
          });
        });
        n.catch(function (r) {
          e._version === t && (ct(e, void 0, n), e._rejected(r));
        });
      }

      return new Promise(function (e) {
        e(r.next());
      }).then(function (e) {
        if (!e.done) return n.then(o), e.value;
      });
    }(e, n, o, t)) : t;
    var i;
  });
  o.then(function (t) {
    e._version === n && (e._value = t, e._fulfilled(t));
  }, function (t) {
    e._version === n && (e._value = void 0, e._rejected(t));
  });
}

function ct(e, t, n) {
  var r = e._module._runtime;
  return e._value = t, e._promise = n, e._outputs.forEach(r._updates.add, r._updates), r._compute();
}

Object.defineProperties(ot, {
  load: {
    value: function (e, t, n) {
      if ("function" == typeof t && (n = t, t = null), "function" != typeof n) throw new Error("invalid observer");
      null == t && (t = new Ae());
      const {
        modules: r,
        id: o
      } = e,
            i = new Map(),
            a = new ot(t),
            u = l(o);

      function l(e) {
        let t = i.get(e);
        return t || i.set(e, t = a.module()), t;
      }

      for (const e of r) {
        const t = l(e.id);
        let r = 0;

        for (const o of e.variables) o.from ? t.import(o.remote, o.name, l(o.from)) : t === u ? t.variable(n(o, r, e.variables)).define(o.name, o.inputs, o.value) : t.define(o.name, o.inputs, o.value), ++r;
      }

      return a;
    },
    writable: !0,
    configurable: !0
  }
}), Object.defineProperties(ot.prototype, {
  _compute: {
    value: function () {
      return this._computing || (this._computing = this._computeSoon());
    },
    writable: !0,
    configurable: !0
  },
  _computeSoon: {
    value: function () {
      var e = this;
      return new Promise(function (t) {
        requestAnimationFrame(function () {
          t(), e._computeNow();
        });
      });
    },
    writable: !0,
    configurable: !0
  },
  _computeNow: {
    value: function () {
      var e,
          t,
          n = [];
      (e = new Set(this._dirty)).forEach(function (t) {
        t._inputs.forEach(e.add, e);

        const n = function (e) {
          if (e._observer !== Ve) return !0;
          var t = new Set(e._outputs);

          for (const e of t) {
            if (e._observer !== Ve) return !0;

            e._outputs.forEach(t.add, t);
          }

          return !1;
        }(t);

        n > t._reachable ? this._updates.add(t) : n < t._reachable && t._invalidate(), t._reachable = n;
      }, this), (e = new Set(this._updates)).forEach(function (t) {
        t._reachable ? (t._indegree = 0, t._outputs.forEach(e.add, e)) : (t._indegree = -1, e.delete(t));
      }), this._computing = null, this._updates.clear(), this._dirty.clear(), e.forEach(function (e) {
        e._outputs.forEach(it);
      }), e.forEach(function (e) {
        0 === e._indegree && n.push(e);
      });

      for (; t = n.pop();) st(t), t._outputs.forEach(r), e.delete(t);

      function r(e) {
        0 == --e._indegree && n.push(e);
      }

      e.forEach(function (e) {
        var t = new Te("circular definition");
        e._value = void 0, (e._promise = Promise.reject(t)).catch(He), e._rejected(t);
      });
    },
    writable: !0,
    configurable: !0
  },
  module: {
    value: function () {
      return new et(this);
    },
    writable: !0,
    configurable: !0
  }
});
export { G as Inspector, Ae as Library, ot as Runtime, Te as RuntimeError };