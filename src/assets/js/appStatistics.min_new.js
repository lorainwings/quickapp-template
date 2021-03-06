const config = { url: 'http://log.ktj.wankacn.com' }
var CryptoJS =
  CryptoJS ||
  (function(e, t) {
    var r = {},
      i = (r.lib = {}),
      n = function() {},
      s = (i.Base = {
        extend: function(e) {
          n.prototype = this
          var t = new n()
          return (
            e && t.mixIn(e),
            t.hasOwnProperty('init') ||
              (t.init = function() {
                t.$super.init.apply(this, arguments)
              }),
            (t.init.prototype = t),
            (t.$super = this),
            t
          )
        },
        create: function() {
          var e = this.extend()
          return e.init.apply(e, arguments), e
        },
        init: function() {},
        mixIn: function(e) {
          for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t])
          e.hasOwnProperty('toString') && (this.toString = e.toString)
        },
        clone: function() {
          return this.init.prototype.extend(this)
        }
      }),
      o = (i.WordArray = s.extend({
        init: function(e, t) {
          ;(e = this.words = e || []), (this.sigBytes = null != t ? t : 4 * e.length)
        },
        toString: function(e) {
          return (e || c).stringify(this)
        },
        concat: function(e) {
          var t = this.words,
            r = e.words,
            i = this.sigBytes
          if (((e = e.sigBytes), this.clamp(), i % 4))
            for (var n = 0; n < e; n++)
              t[(i + n) >>> 2] |= ((r[n >>> 2] >>> (24 - (n % 4) * 8)) & 255) << (24 - ((i + n) % 4) * 8)
          else if (65535 < r.length) for (n = 0; n < e; n += 4) t[(i + n) >>> 2] = r[n >>> 2]
          else t.push.apply(t, r)
          return (this.sigBytes += e), this
        },
        clamp: function() {
          var t = this.words,
            r = this.sigBytes
          ;(t[r >>> 2] &= 4294967295 << (32 - (r % 4) * 8)), (t.length = e.ceil(r / 4))
        },
        clone: function() {
          var e = s.clone.call(this)
          return (e.words = this.words.slice(0)), e
        },
        random: function(t) {
          for (var r = [], i = 0; i < t; i += 4) r.push((4294967296 * e.random()) | 0)
          return new o.init(r, t)
        }
      })),
      a = (r.enc = {}),
      c = (a.Hex = {
        stringify: function(e) {
          var t = e.words
          e = e.sigBytes
          for (var r = [], i = 0; i < e; i++) {
            var n = (t[i >>> 2] >>> (24 - (i % 4) * 8)) & 255
            r.push((n >>> 4).toString(16)), r.push((15 & n).toString(16))
          }
          return r.join('')
        },
        parse: function(e) {
          for (var t = e.length, r = [], i = 0; i < t; i += 2)
            r[i >>> 3] |= parseInt(e.substr(i, 2), 16) << (24 - (i % 8) * 4)
          return new o.init(r, t / 2)
        }
      }),
      u = (a.Latin1 = {
        stringify: function(e) {
          var t = e.words
          e = e.sigBytes
          for (var r = [], i = 0; i < e; i++)
            r.push(String.fromCharCode((t[i >>> 2] >>> (24 - (i % 4) * 8)) & 255))
          return r.join('')
        },
        parse: function(e) {
          for (var t = e.length, r = [], i = 0; i < t; i++)
            r[i >>> 2] |= (255 & e.charCodeAt(i)) << (24 - (i % 4) * 8)
          return new o.init(r, t)
        }
      }),
      h = (a.Utf8 = {
        stringify: function(e) {
          try {
            return decodeURIComponent(escape(u.stringify(e)))
          } catch (e) {
            throw Error('Malformed UTF-8 data')
          }
        },
        parse: function(e) {
          return u.parse(unescape(encodeURIComponent(e)))
        }
      }),
      p = (i.BufferedBlockAlgorithm = s.extend({
        reset: function() {
          ;(this._data = new o.init()), (this._nDataBytes = 0)
        },
        _append: function(e) {
          'string' == typeof e && (e = h.parse(e)), this._data.concat(e), (this._nDataBytes += e.sigBytes)
        },
        _process: function(t) {
          var r = this._data,
            i = r.words,
            n = r.sigBytes,
            s = this.blockSize,
            a = n / (4 * s)
          if (
            ((t = (a = t ? e.ceil(a) : e.max((0 | a) - this._minBufferSize, 0)) * s),
            (n = e.min(4 * t, n)),
            t)
          ) {
            for (var c = 0; c < t; c += s) this._doProcessBlock(i, c)
            ;(c = i.splice(0, t)), (r.sigBytes -= n)
          }
          return new o.init(c, n)
        },
        clone: function() {
          var e = s.clone.call(this)
          return (e._data = this._data.clone()), e
        },
        _minBufferSize: 0
      }))
    i.Hasher = p.extend({
      cfg: s.extend(),
      init: function(e) {
        ;(this.cfg = this.cfg.extend(e)), this.reset()
      },
      reset: function() {
        p.reset.call(this), this._doReset()
      },
      update: function(e) {
        return this._append(e), this._process(), this
      },
      finalize: function(e) {
        return e && this._append(e), this._doFinalize()
      },
      blockSize: 16,
      _createHelper: function(e) {
        return function(t, r) {
          return new e.init(r).finalize(t)
        }
      },
      _createHmacHelper: function(e) {
        return function(t, r) {
          return new f.HMAC.init(e, r).finalize(t)
        }
      }
    })
    var f = (r.algo = {})
    return r
  })(Math)
!(function() {
  var e = CryptoJS,
    t = e.lib.WordArray
  e.enc.Base64 = {
    stringify: function(e) {
      var t = e.words,
        r = e.sigBytes,
        i = this._map
      e.clamp(), (e = [])
      for (var n = 0; n < r; n += 3)
        for (
          var s =
              (((t[n >>> 2] >>> (24 - (n % 4) * 8)) & 255) << 16) |
              (((t[(n + 1) >>> 2] >>> (24 - ((n + 1) % 4) * 8)) & 255) << 8) |
              ((t[(n + 2) >>> 2] >>> (24 - ((n + 2) % 4) * 8)) & 255),
            o = 0;
          4 > o && n + 0.75 * o < r;
          o++
        )
          e.push(i.charAt((s >>> (6 * (3 - o))) & 63))
      if ((t = i.charAt(64))) for (; e.length % 4; ) e.push(t)
      return e.join('')
    },
    parse: function(e) {
      var r = e.length,
        i = this._map
      ;(n = i.charAt(64)) && (-1 != (n = e.indexOf(n)) && (r = n))
      for (var n = [], s = 0, o = 0; o < r; o++)
        if (o % 4) {
          var a = i.indexOf(e.charAt(o - 1)) << ((o % 4) * 2),
            c = i.indexOf(e.charAt(o)) >>> (6 - (o % 4) * 2)
          ;(n[s >>> 2] |= (a | c) << (24 - (s % 4) * 8)), s++
        }
      return t.create(n, s)
    },
    _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  }
})(),
  (function(e) {
    function t(e, t, r, i, n, s, o) {
      return (((e = e + ((t & r) | (~t & i)) + n + o) << s) | (e >>> (32 - s))) + t
    }
    function r(e, t, r, i, n, s, o) {
      return (((e = e + ((t & i) | (r & ~i)) + n + o) << s) | (e >>> (32 - s))) + t
    }
    function i(e, t, r, i, n, s, o) {
      return (((e = e + (t ^ r ^ i) + n + o) << s) | (e >>> (32 - s))) + t
    }
    function n(e, t, r, i, n, s, o) {
      return (((e = e + (r ^ (t | ~i)) + n + o) << s) | (e >>> (32 - s))) + t
    }
    for (var s = CryptoJS, o = (c = s.lib).WordArray, a = c.Hasher, c = s.algo, u = [], h = 0; 64 > h; h++)
      u[h] = (4294967296 * e.abs(e.sin(h + 1))) | 0
    ;(c = c.MD5 = a.extend({
      _doReset: function() {
        this._hash = new o.init([1732584193, 4023233417, 2562383102, 271733878])
      },
      _doProcessBlock: function(e, s) {
        for (var o = 0; 16 > o; o++) {
          var a = e[(c = s + o)]
          e[c] = (16711935 & ((a << 8) | (a >>> 24))) | (4278255360 & ((a << 24) | (a >>> 8)))
        }
        o = this._hash.words
        var c = e[s + 0],
          h = ((a = e[s + 1]), e[s + 2]),
          p = e[s + 3],
          f = e[s + 4],
          d = e[s + 5],
          _ = e[s + 6],
          l = e[s + 7],
          g = e[s + 8],
          y = e[s + 9],
          m = e[s + 10],
          v = e[s + 11],
          k = e[s + 12],
          S = e[s + 13],
          w = e[s + 14],
          B = e[s + 15],
          C = t((C = o[0]), (P = o[1]), (x = o[2]), (b = o[3]), c, 7, u[0]),
          b = t(b, C, P, x, a, 12, u[1]),
          x = t(x, b, C, P, h, 17, u[2]),
          P = t(P, x, b, C, p, 22, u[3])
        ;(C = t(C, P, x, b, f, 7, u[4])),
          (b = t(b, C, P, x, d, 12, u[5])),
          (x = t(x, b, C, P, _, 17, u[6])),
          (P = t(P, x, b, C, l, 22, u[7])),
          (C = t(C, P, x, b, g, 7, u[8])),
          (b = t(b, C, P, x, y, 12, u[9])),
          (x = t(x, b, C, P, m, 17, u[10])),
          (P = t(P, x, b, C, v, 22, u[11])),
          (C = t(C, P, x, b, k, 7, u[12])),
          (b = t(b, C, P, x, S, 12, u[13])),
          (x = t(x, b, C, P, w, 17, u[14])),
          (C = r(C, (P = t(P, x, b, C, B, 22, u[15])), x, b, a, 5, u[16])),
          (b = r(b, C, P, x, _, 9, u[17])),
          (x = r(x, b, C, P, v, 14, u[18])),
          (P = r(P, x, b, C, c, 20, u[19])),
          (C = r(C, P, x, b, d, 5, u[20])),
          (b = r(b, C, P, x, m, 9, u[21])),
          (x = r(x, b, C, P, B, 14, u[22])),
          (P = r(P, x, b, C, f, 20, u[23])),
          (C = r(C, P, x, b, y, 5, u[24])),
          (b = r(b, C, P, x, w, 9, u[25])),
          (x = r(x, b, C, P, p, 14, u[26])),
          (P = r(P, x, b, C, g, 20, u[27])),
          (C = r(C, P, x, b, S, 5, u[28])),
          (b = r(b, C, P, x, h, 9, u[29])),
          (x = r(x, b, C, P, l, 14, u[30])),
          (C = i(C, (P = r(P, x, b, C, k, 20, u[31])), x, b, d, 4, u[32])),
          (b = i(b, C, P, x, g, 11, u[33])),
          (x = i(x, b, C, P, v, 16, u[34])),
          (P = i(P, x, b, C, w, 23, u[35])),
          (C = i(C, P, x, b, a, 4, u[36])),
          (b = i(b, C, P, x, f, 11, u[37])),
          (x = i(x, b, C, P, l, 16, u[38])),
          (P = i(P, x, b, C, m, 23, u[39])),
          (C = i(C, P, x, b, S, 4, u[40])),
          (b = i(b, C, P, x, c, 11, u[41])),
          (x = i(x, b, C, P, p, 16, u[42])),
          (P = i(P, x, b, C, _, 23, u[43])),
          (C = i(C, P, x, b, y, 4, u[44])),
          (b = i(b, C, P, x, k, 11, u[45])),
          (x = i(x, b, C, P, B, 16, u[46])),
          (C = n(C, (P = i(P, x, b, C, h, 23, u[47])), x, b, c, 6, u[48])),
          (b = n(b, C, P, x, l, 10, u[49])),
          (x = n(x, b, C, P, w, 15, u[50])),
          (P = n(P, x, b, C, d, 21, u[51])),
          (C = n(C, P, x, b, k, 6, u[52])),
          (b = n(b, C, P, x, p, 10, u[53])),
          (x = n(x, b, C, P, m, 15, u[54])),
          (P = n(P, x, b, C, a, 21, u[55])),
          (C = n(C, P, x, b, g, 6, u[56])),
          (b = n(b, C, P, x, B, 10, u[57])),
          (x = n(x, b, C, P, _, 15, u[58])),
          (P = n(P, x, b, C, S, 21, u[59])),
          (C = n(C, P, x, b, f, 6, u[60])),
          (b = n(b, C, P, x, v, 10, u[61])),
          (x = n(x, b, C, P, h, 15, u[62])),
          (P = n(P, x, b, C, y, 21, u[63]))
        ;(o[0] = (o[0] + C) | 0), (o[1] = (o[1] + P) | 0), (o[2] = (o[2] + x) | 0), (o[3] = (o[3] + b) | 0)
      },
      _doFinalize: function() {
        var t = this._data,
          r = t.words,
          i = 8 * this._nDataBytes,
          n = 8 * t.sigBytes
        r[n >>> 5] |= 128 << (24 - (n % 32))
        var s = e.floor(i / 4294967296)
        for (
          r[15 + (((n + 64) >>> 9) << 4)] =
            (16711935 & ((s << 8) | (s >>> 24))) | (4278255360 & ((s << 24) | (s >>> 8))),
            r[14 + (((n + 64) >>> 9) << 4)] =
              (16711935 & ((i << 8) | (i >>> 24))) | (4278255360 & ((i << 24) | (i >>> 8))),
            t.sigBytes = 4 * (r.length + 1),
            this._process(),
            r = (t = this._hash).words,
            i = 0;
          4 > i;
          i++
        )
          (n = r[i]), (r[i] = (16711935 & ((n << 8) | (n >>> 24))) | (4278255360 & ((n << 24) | (n >>> 8))))
        return t
      },
      clone: function() {
        var e = a.clone.call(this)
        return (e._hash = this._hash.clone()), e
      }
    })),
      (s.MD5 = a._createHelper(c)),
      (s.HmacMD5 = a._createHmacHelper(c))
  })(Math),
  (function() {
    var e,
      t = CryptoJS,
      r = (e = t.lib).Base,
      i = e.WordArray,
      n = ((e = t.algo).EvpKDF = r.extend({
        cfg: r.extend({ keySize: 4, hasher: e.MD5, iterations: 1 }),
        init: function(e) {
          this.cfg = this.cfg.extend(e)
        },
        compute: function(e, t) {
          for (
            var r = (a = this.cfg).hasher.create(),
              n = i.create(),
              s = n.words,
              o = a.keySize,
              a = a.iterations;
            s.length < o;

          ) {
            c && r.update(c)
            var c = r.update(e).finalize(t)
            r.reset()
            for (var u = 1; u < a; u++) (c = r.finalize(c)), r.reset()
            n.concat(c)
          }
          return (n.sigBytes = 4 * o), n
        }
      }))
    t.EvpKDF = function(e, t, r) {
      return n.create(r).compute(e, t)
    }
  })(),
  CryptoJS.lib.Cipher ||
    (function(e) {
      var t = (d = CryptoJS).lib,
        r = t.Base,
        i = t.WordArray,
        n = t.BufferedBlockAlgorithm,
        s = d.enc.Base64,
        o = d.algo.EvpKDF,
        a = (t.Cipher = n.extend({
          cfg: r.extend(),
          createEncryptor: function(e, t) {
            return this.create(this._ENC_XFORM_MODE, e, t)
          },
          createDecryptor: function(e, t) {
            return this.create(this._DEC_XFORM_MODE, e, t)
          },
          init: function(e, t, r) {
            ;(this.cfg = this.cfg.extend(r)), (this._xformMode = e), (this._key = t), this.reset()
          },
          reset: function() {
            n.reset.call(this), this._doReset()
          },
          process: function(e) {
            return this._append(e), this._process()
          },
          finalize: function(e) {
            return e && this._append(e), this._doFinalize()
          },
          keySize: 4,
          ivSize: 4,
          _ENC_XFORM_MODE: 1,
          _DEC_XFORM_MODE: 2,
          _createHelper: function(e) {
            return {
              encrypt: function(t, r, i) {
                return ('string' == typeof r ? _ : f).encrypt(e, t, r, i)
              },
              decrypt: function(t, r, i) {
                return ('string' == typeof r ? _ : f).decrypt(e, t, r, i)
              }
            }
          }
        }))
      t.StreamCipher = a.extend({
        _doFinalize: function() {
          return this._process(!0)
        },
        blockSize: 1
      })
      var c = (d.mode = {}),
        u = function(e, t, r) {
          var i = this._iv
          i ? (this._iv = void 0) : (i = this._prevBlock)
          for (var n = 0; n < r; n++) e[t + n] ^= i[n]
        },
        h = (t.BlockCipherMode = r.extend({
          createEncryptor: function(e, t) {
            return this.Encryptor.create(e, t)
          },
          createDecryptor: function(e, t) {
            return this.Decryptor.create(e, t)
          },
          init: function(e, t) {
            ;(this._cipher = e), (this._iv = t)
          }
        })).extend()
      ;(h.Encryptor = h.extend({
        processBlock: function(e, t) {
          var r = this._cipher,
            i = r.blockSize
          u.call(this, e, t, i), r.encryptBlock(e, t), (this._prevBlock = e.slice(t, t + i))
        }
      })),
        (h.Decryptor = h.extend({
          processBlock: function(e, t) {
            var r = this._cipher,
              i = r.blockSize,
              n = e.slice(t, t + i)
            r.decryptBlock(e, t), u.call(this, e, t, i), (this._prevBlock = n)
          }
        })),
        (c = c.CBC = h),
        (h = (d.pad = {}).Pkcs7 = {
          pad: function(e, t) {
            for (
              var r,
                n = ((r = (r = 4 * t) - (e.sigBytes % r)) << 24) | (r << 16) | (r << 8) | r,
                s = [],
                o = 0;
              o < r;
              o += 4
            )
              s.push(n)
            ;(r = i.create(s, r)), e.concat(r)
          },
          unpad: function(e) {
            e.sigBytes -= 255 & e.words[(e.sigBytes - 1) >>> 2]
          }
        }),
        (t.BlockCipher = a.extend({
          cfg: a.cfg.extend({ mode: c, padding: h }),
          reset: function() {
            a.reset.call(this)
            var e = (t = this.cfg).iv,
              t = t.mode
            if (this._xformMode == this._ENC_XFORM_MODE) var r = t.createEncryptor
            else (r = t.createDecryptor), (this._minBufferSize = 1)
            this._mode = r.call(t, this, e && e.words)
          },
          _doProcessBlock: function(e, t) {
            this._mode.processBlock(e, t)
          },
          _doFinalize: function() {
            var e = this.cfg.padding
            if (this._xformMode == this._ENC_XFORM_MODE) {
              e.pad(this._data, this.blockSize)
              var t = this._process(!0)
            } else (t = this._process(!0)), e.unpad(t)
            return t
          },
          blockSize: 4
        }))
      var p = (t.CipherParams = r.extend({
          init: function(e) {
            this.mixIn(e)
          },
          toString: function(e) {
            return (e || this.formatter).stringify(this)
          }
        })),
        f =
          ((c = (d.format = {}).OpenSSL = {
            stringify: function(e) {
              var t = e.ciphertext
              return ((e = e.salt)
                ? i
                    .create([1398893684, 1701076831])
                    .concat(e)
                    .concat(t)
                : t
              ).toString(s)
            },
            parse: function(e) {
              var t = (e = s.parse(e)).words
              if (1398893684 == t[0] && 1701076831 == t[1]) {
                var r = i.create(t.slice(2, 4))
                t.splice(0, 4), (e.sigBytes -= 16)
              }
              return p.create({ ciphertext: e, salt: r })
            }
          }),
          (t.SerializableCipher = r.extend({
            cfg: r.extend({ format: c }),
            encrypt: function(e, t, r, i) {
              i = this.cfg.extend(i)
              var n = e.createEncryptor(r, i)
              return (
                (t = n.finalize(t)),
                (n = n.cfg),
                p.create({
                  ciphertext: t,
                  key: r,
                  iv: n.iv,
                  algorithm: e,
                  mode: n.mode,
                  padding: n.padding,
                  blockSize: e.blockSize,
                  formatter: i.format
                })
              )
            },
            decrypt: function(e, t, r, i) {
              return (
                (i = this.cfg.extend(i)),
                (t = this._parse(t, i.format)),
                e.createDecryptor(r, i).finalize(t.ciphertext)
              )
            },
            _parse: function(e, t) {
              return 'string' == typeof e ? t.parse(e, this) : e
            }
          }))),
        d = ((d.kdf = {}).OpenSSL = {
          execute: function(e, t, r, n) {
            return (
              n || (n = i.random(8)),
              (e = o.create({ keySize: t + r }).compute(e, n)),
              (r = i.create(e.words.slice(t), 4 * r)),
              (e.sigBytes = 4 * t),
              p.create({ key: e, iv: r, salt: n })
            )
          }
        }),
        _ = (t.PasswordBasedCipher = f.extend({
          cfg: f.cfg.extend({ kdf: d }),
          encrypt: function(e, t, r, i) {
            return (
              (r = (i = this.cfg.extend(i)).kdf.execute(r, e.keySize, e.ivSize)),
              (i.iv = r.iv),
              (e = f.encrypt.call(this, e, t, r.key, i)).mixIn(r),
              e
            )
          },
          decrypt: function(e, t, r, i) {
            return (
              (i = this.cfg.extend(i)),
              (t = this._parse(t, i.format)),
              (r = i.kdf.execute(r, e.keySize, e.ivSize, t.salt)),
              (i.iv = r.iv),
              f.decrypt.call(this, e, t, r.key, i)
            )
          }
        }))
    })(),
  (function() {
    for (
      var e = CryptoJS,
        t = e.lib.BlockCipher,
        r = e.algo,
        i = [],
        n = [],
        s = [],
        o = [],
        a = [],
        c = [],
        u = [],
        h = [],
        p = [],
        f = [],
        d = [],
        _ = 0;
      256 > _;
      _++
    )
      d[_] = 128 > _ ? _ << 1 : (_ << 1) ^ 283
    var l = 0,
      g = 0
    for (_ = 0; 256 > _; _++) {
      var y = ((y = g ^ (g << 1) ^ (g << 2) ^ (g << 3) ^ (g << 4)) >>> 8) ^ (255 & y) ^ 99
      ;(i[l] = y), (n[y] = l)
      var m = d[l],
        v = d[m],
        k = d[v],
        S = (257 * d[y]) ^ (16843008 * y)
      ;(s[l] = (S << 24) | (S >>> 8)),
        (o[l] = (S << 16) | (S >>> 16)),
        (a[l] = (S << 8) | (S >>> 24)),
        (c[l] = S),
        (S = (16843009 * k) ^ (65537 * v) ^ (257 * m) ^ (16843008 * l)),
        (u[y] = (S << 24) | (S >>> 8)),
        (h[y] = (S << 16) | (S >>> 16)),
        (p[y] = (S << 8) | (S >>> 24)),
        (f[y] = S),
        l ? ((l = m ^ d[d[d[k ^ m]]]), (g ^= d[d[g]])) : (l = g = 1)
    }
    var w = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54]
    r = r.AES = t.extend({
      _doReset: function() {
        for (
          var e = (r = this._key).words,
            t = r.sigBytes / 4,
            r = 4 * ((this._nRounds = t + 6) + 1),
            n = (this._keySchedule = []),
            s = 0;
          s < r;
          s++
        )
          if (s < t) n[s] = e[s]
          else {
            var o = n[s - 1]
            s % t
              ? 6 < t &&
                4 == s % t &&
                (o =
                  (i[o >>> 24] << 24) | (i[(o >>> 16) & 255] << 16) | (i[(o >>> 8) & 255] << 8) | i[255 & o])
              : ((o =
                  (i[(o = (o << 8) | (o >>> 24)) >>> 24] << 24) |
                  (i[(o >>> 16) & 255] << 16) |
                  (i[(o >>> 8) & 255] << 8) |
                  i[255 & o]),
                (o ^= w[(s / t) | 0] << 24)),
              (n[s] = n[s - t] ^ o)
          }
        for (e = this._invKeySchedule = [], t = 0; t < r; t++)
          (s = r - t),
            (o = t % 4 ? n[s] : n[s - 4]),
            (e[t] =
              4 > t || 4 >= s
                ? o
                : u[i[o >>> 24]] ^ h[i[(o >>> 16) & 255]] ^ p[i[(o >>> 8) & 255]] ^ f[i[255 & o]])
      },
      encryptBlock: function(e, t) {
        this._doCryptBlock(e, t, this._keySchedule, s, o, a, c, i)
      },
      decryptBlock: function(e, t) {
        var r = e[t + 1]
        ;(e[t + 1] = e[t + 3]),
          (e[t + 3] = r),
          this._doCryptBlock(e, t, this._invKeySchedule, u, h, p, f, n),
          (r = e[t + 1]),
          (e[t + 1] = e[t + 3]),
          (e[t + 3] = r)
      },
      _doCryptBlock: function(e, t, r, i, n, s, o, a) {
        for (
          var c = this._nRounds,
            u = e[t] ^ r[0],
            h = e[t + 1] ^ r[1],
            p = e[t + 2] ^ r[2],
            f = e[t + 3] ^ r[3],
            d = 4,
            _ = 1;
          _ < c;
          _++
        ) {
          var l = i[u >>> 24] ^ n[(h >>> 16) & 255] ^ s[(p >>> 8) & 255] ^ o[255 & f] ^ r[d++],
            g = i[h >>> 24] ^ n[(p >>> 16) & 255] ^ s[(f >>> 8) & 255] ^ o[255 & u] ^ r[d++],
            y = i[p >>> 24] ^ n[(f >>> 16) & 255] ^ s[(u >>> 8) & 255] ^ o[255 & h] ^ r[d++]
          ;(f = i[f >>> 24] ^ n[(u >>> 16) & 255] ^ s[(h >>> 8) & 255] ^ o[255 & p] ^ r[d++]),
            (u = l),
            (h = g),
            (p = y)
        }
        ;(l =
          ((a[u >>> 24] << 24) | (a[(h >>> 16) & 255] << 16) | (a[(p >>> 8) & 255] << 8) | a[255 & f]) ^
          r[d++]),
          (g =
            ((a[h >>> 24] << 24) | (a[(p >>> 16) & 255] << 16) | (a[(f >>> 8) & 255] << 8) | a[255 & u]) ^
            r[d++]),
          (y =
            ((a[p >>> 24] << 24) | (a[(f >>> 16) & 255] << 16) | (a[(u >>> 8) & 255] << 8) | a[255 & h]) ^
            r[d++]),
          (f =
            ((a[f >>> 24] << 24) | (a[(u >>> 16) & 255] << 16) | (a[(h >>> 8) & 255] << 8) | a[255 & p]) ^
            r[d++]),
          (e[t] = l),
          (e[t + 1] = g),
          (e[t + 2] = y),
          (e[t + 3] = f)
      },
      keySize: 8
    })
    e.AES = t._createHelper(r)
  })(),
  (CryptoJS.pad.ZeroPadding = {
    pad: function(e, t) {
      var r = 4 * t
      e.clamp(), (e.sigBytes += r - (e.sigBytes % r || r))
    },
    unpad: function(e) {
      for (var t = e.words, r = e.sigBytes - 1; !((t[r >>> 2] >>> (24 - (r % 4) * 8)) & 255); ) r--
      e.sigBytes = r + 1
    }
  })
import storage from '@system.storage'
import nativeFetch from '@system.fetch'
import device from '@system.device'
import network from '@system.network'
import account from '@service.account'
import shortcut from '@system.shortcut'
import md5 from 'md5'
import app from '@system.app'
import router from '@system.router'
import APP_CONFIG from './statistics.config'
!(function(e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define(t)
    : (e.APP_STATISTICS = t())
})(this, function() {
  'use strict'
  function e(e) {
    let t = ''
    for (let r in e) t += r + '=' + e[r] + '&'
    return (t = t.substring(0, t.length - 1))
  }
  function t(e) {
    return JSON.stringify(e)
  }
  function r(e, t) {
    let r = md5('huanju@quickapp' + t)
        .substring(16)
        .toLowerCase(),
      i = CryptoJS.enc.Latin1.parse(r),
      n = CryptoJS.enc.Latin1.parse('2018080716102000')
    return CryptoJS.AES.encrypt(e, i, {
      iv: n,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    }).toString()
  }
  function i() {
    return ((268435456 * (1 + Math.random())) | 0).toString(16)
  }
  function n(e) {
    let t = /^[0-9a-zA-Z_\u4e00-\u9fa5]{0,255}$/,
      r = 0
    if ('string' == typeof e && t.test(e)) return !0
    if (
      (function(e) {
        if ('object' != typeof e || null == e) return !1
        if (null === Object.getPrototypeOf(e)) return !0
        let t = e
        for (; null !== Object.getPrototypeOf(t); ) t = Object.getPrototypeOf(t)
        return Object.getPrototypeOf(e) === t
      })(e)
    ) {
      for (let i in e) {
        let n = e[i]
        if (('string' != typeof i && 'number' != typeof i) || !/^[0-9a-zA-Z_\u4e00-\u9fa5]{1,255}$/.test(i))
          return !1
        if (('string' != typeof n && 'number' != typeof n) || !t.test(n)) return !1
        r++
      }
      return !(r > 100)
    }
    return !1
  }
  const s = {
    get: function(e) {
      let { url: t, timeout: r } = e,
        i = new Promise((e, r) => {
          try {
            nativeFetch.fetch({
              url: config.url + t,
              success: function(t) {
                e(t)
              },
              fail: function(t, r) {
                e(t)
              }
            })
          } catch (e) {}
        }),
        n = new Promise((e, t) => {
          setTimeout(() => {
            e({ code: 204, massage: 'Request timed out' })
          }, r || 3e3)
        })
      return Promise.race([n, i])
    }
  }
  function o(e) {
    return s.get({ url: '/a.gif?' + e })
  }
  function a(...e) {
    return new Promise((t, r) => {
      try {
        storage.set({
          key: e[0],
          value: e[1] || '',
          success: function(e) {
            t(!0)
          },
          fail: function(e) {
            t(!1)
          }
        })
      } catch (e) {
        t(!1)
      }
    })
  }
  function c(e) {
    return new Promise((t, r) => {
      try {
        storage.get({
          key: e,
          success: function(e) {
            t(e)
          },
          fail: function(e, r) {
            t(!1)
          }
        })
      } catch (e) {
        t(!1)
      }
    })
  }
  const u = {
      deviceIds: () =>
        new Promise((e, t) => {
          try {
            device.getId({
              type: ['device', 'mac'],
              success: function(t) {
                e(t)
              },
              fail: function(t, r) {
                e({})
              }
            })
          } catch (t) {
            e({})
          }
        }),
      getUserId: () =>
        new Promise((e, t) => {
          try {
            device.getUserId({
              success: function(t) {
                e(t)
              },
              fail: function(t, r) {
                e({})
              }
            })
          } catch (t) {
            e({})
          }
        }),
      deviceInfos: () =>
        new Promise((e, t) => {
          try {
            device.getInfo({
              success: function(t) {
                e(t)
              },
              fail: function() {
                e({})
              }
            })
          } catch (t) {
            e({})
          }
        }),
      netType: () =>
        new Promise((e, t) => {
          try {
            network.getType({
              success: function(t) {
                e(t)
              },
              fail: function() {
                e({})
              }
            })
          } catch (t) {
            e({})
          }
        }),
      has_shortcut: () =>
        new Promise((e, t) => {
          try {
            shortcut.hasInstalled({
              success: function(t) {
                e({ has_icon: t ? 1 : 0 })
              },
              fail: function() {
                e({ has_icon: 0 })
              }
            })
          } catch (t) {
            e({ has_icon: 0 })
          }
        })
    },
    h = { sdk_version: '1.3.0.0', debug: 0 },
    p = '_SD_BD_CUID_',
    f = '_SD_BD_ERR_MSG_INFO_',
    d = {
      has_init: !1,
      has_cuid_storage: !1,
      has_request_id_storage: !1,
      has_open_log: !1
    }
  const _ = {
      device: (e, t) => ({
        package: e.package || '',
        channel: e.channel || '',
        name: e.name || '',
        svr: e.versionName || '',
        client_id: r(e.device || '', t),
        info_ma: r(e.mac || '', t),
        os_id: r(e.userId || '', t),
        make: (e.brand || '').toLowerCase(),
        manufacturer: (e.manufacturer || '').toLowerCase(),
        model: (e.model || '').toLowerCase(),
        product: (e.product || '').toLowerCase(),
        os_type: e.osType || '',
        ovr: e.osVersionName || '',
        pla_ver: e.platformVersionName || '',
        lan: (e.language || '').toLowerCase(),
        region: (e.region || '').toLowerCase(),
        px: `${e.screenWidth || ''}*${e.screenHeight || ''}`,
        net: e.type || '',
        has_icon: e.has_icon || 0
      }),
      page: (e = {}) => ({
        page_name: '',
        page_path: '',
        sta_time: '',
        end_time: '',
        duration: '',
        is_entry: 0,
        ...e
      }),
      public: e => ({
        app_id: APP_CONFIG.app_key || '',
        cuid: e.cuid,
        req_id: e.req,
        en_code: 'cuid',
        action: 2
      })
    },
    l = new (class {
      constructor() {
        ;(this.state = {
          data: null,
          page: null,
          is_entry: 1,
          cuid: '',
          req: '',
          log_list: []
        }),
          (this.init = this.init.bind(this)),
          (this.page_stat = this.page_stat.bind(this)),
          (this.page_end = this.page_end.bind(this)),
          (this.merge_datas = this.merge_datas.bind(this)),
          (this.save_to_queue = this.save_to_queue.bind(this)),
          (this.handle_submit = this.handle_submit.bind(this)),
          (this.send_queue = this.send_queue.bind(this)),
          (this.event_log = this.event_log.bind(this)),
          (this.err_report = this.err_report.bind(this))
      }
      init(e) {
        d.has_init = !0
        let r = {},
          n = e || { _def: {} }
        n._def = n._def || { manifest: {} }
        let s,
          {
            _def: { manifest: o }
          } = n
        try {
          s = app.getInfo()
        } catch (e) {
          let r = { err_msg: t(e.stack) || '', err_site: 'app.getInfo' }
          l.err_report(r)
        }
        ;(r.package = o.package || s.packageName),
          (r.versionName = o.versionName || s.versionName),
          (r.minPlatformVersion = o.minPlatformVersion || ''),
          (r.name = o.name || s.name)
        try {
          r.channel = account.getProvider()
        } catch (e) {
          let r = { err_msg: t(e.stack) || '', err_site: 'account.getProvider' }
          l.err_report(r)
        }
        Promise.all([u.deviceInfos(), u.getUserId(), u.netType(), u.has_shortcut()]).then(e => {
          let t = Object.assign(r, ...e),
            n = {}
          c(p).then(e => {
            e
              ? (n.cuid = e)
              : ((n.cuid = (function(e) {
                  let t = e || i()
                  return md5(Date.now() + '-' + i() + '-' + i() + '-' + i() + '-' + t)
                })(t.userId || '')),
                a(p, n.cuid).then(e => {
                  e && (d.has_cuid_storage = !0)
                })),
              (this.state.cuid = n.cuid),
              (n.req = this.state.req = (function(e) {
                let t = Date.now() + i() + i() + (e || i())
                return md5(t)
              })(n.cuid)),
              (this.state.data = { ..._.device(t, this.state.cuid), ..._.public(n) })
          })
        })
      }
      page_stat(e) {
        let r, i
        try {
          let e = router.getState() || {}
          ;(r = e.name), (i = e.path)
        } catch (e) {
          let r = { err_msg: t(e.stack) || '', err_site: 'router.getState' }
          l.err_report(r)
        }
        ;(this.state.page = _.page({
          sta_time: Date.now(),
          page_name: r || '',
          page_path: i || '',
          is_entry: this.state.is_entry || 0
        })),
          (this.state.is_entry = 0),
          (d.has_open_log = !0)
      }
      page_end(e) {
        if (!this.state.cuid || !this.state.data) return
        let t = Date.now()
        if (this.state.page)
          (this.state.page.duration = t - this.state.page.sta_time),
            (this.state.page.end_time = t),
            this.handle_submit()
        else {
          let e = {
            err_msg: `this.state.page is ${this.state.page}`,
            err_site: 'get_page_data'
          }
          l.err_report(e)
        }
      }
      merge_datas() {
        return { ...(this.state.data || {}), ...(this.state.page || {}), ...h }
      }
      handle_submit(t = {}) {
        let r = e({ ...this.merge_datas(), ...t })
        o(r)
          .then(e => {
            200 == e.code ? this.send_queue() : this.save_to_queue(r)
          })
          .catch(e => {
            this.save_to_queue(r)
          })
      }
      save_to_queue(e) {
        let t = this.state.log_list && this.state.log_list.length
        return t && t < 50 && this.state.log_list.push(`${e}&retry=1`), this.state.log_list
      }
      send_queue() {
        let e = [...this.state.log_list]
        ;(this.state.log_list = []),
          e.forEach(e => {
            o(e)
              .then(t => {
                200 != t.code && this.save_to_queue(e)
              })
              .catch(t => {
                this.save_to_queue(e)
              })
          })
      }
      event_log(e) {
        this.handle_submit({ ...e, action: '3' })
      }
      err_report(r) {
        let i = e({
          ...this.merge_datas(),
          ...r,
          app_id: APP_CONFIG.app_key || '',
          action: '9'
        })
        c(f)
          .then(e => {
            let r = e,
              n = new Date().getDate(),
              o = 0
            if (r)
              try {
                r = JSON.parse(r) && JSON.parse(r)
              } catch (e) {
                r = { day: n, len: 0 }
              }
            ;(r && r.day) == n && (o = Number(r.len) + 1),
              o <= 50 &&
                (function(e) {
                  return s.get({ url: '/e.gif?' + e })
                })(i).then(e => {
                  a(f, t({ day: n, len: o })).then()
                })
          })
          .catch()
      }
    })()
  const g = {
      open_app(e) {
        try {
          if (!APP_CONFIG.app_key) return void console.error('Not configured app_key!')
          l.init(e)
        } catch (e) {
          let r = { err_msg: t(e.stack) || '', err_site: 'open_app' }
          l.err_report(r)
        }
      },
      page_show(e) {
        try {
          d.has_init && l.page_stat(e)
        } catch (e) {
          let r = { err_msg: t(e.stack) || '', err_site: 'page_show' }
          l.err_report(r)
        }
      },
      page_hide(e) {
        try {
          d.has_init && d.has_open_log && l.page_end(e)
        } catch (e) {
          let r = { err_msg: t(e.stack) || '', err_site: 'open_app' }
          l.err_report(r)
        }
        d.has_open_log = !1
      },
      track_event(e, r) {
        try {
          if (!APP_CONFIG.app_key) return void console.error('Not configured app_key!')
          let i = null == r ? '' : r
          if (
            !(function(e) {
              return 'string' == typeof e && '' !== e && /^[0-9a-zA-Z_\u4e00-\u9fa5]{1,255}$/.test(e)
            })(e)
          )
            return void console.error(
              '"event error": please check track_event id. id should be "string" and not null.'
            )
          if (!n(i))
            return void console.error(
              '"event error":  please check track_event parameter. parameter should be "string" or "object"'
            )
          l.event_log({
            ev_id: e,
            ev_args: 'string' == typeof i ? i : JSON.stringify(i)
          })
        } catch (e) {
          console.log('err', e)
          let r = { err_msg: t(e.stack) || '', err_site: 'track_event' }
          l.err_report(r)
        }
      }
    },
    y = global.__proto__ || global
  return (
    (y.APP_STATISTICS = {
      app_sta_init: g.open_app,
      page_show: g.page_show,
      page_hide: g.page_hide,
      track_event: g.track_event
    }),
    (y.Custom_page = function(e) {
      let t = e.onShow,
        r = e.onHide
      return (
        (e.onShow = function() {
          g.page_show(this), t && t.call(this)
        }),
        (e.onHide = function() {
          g.page_hide(this), r && r.call(this)
        }),
        e
      )
    }),
    {
      app_sta_init: g.open_app,
      page_show: g.page_show,
      page_hide: g.page_hide,
      track_event: g.track_event
    }
  )
})
