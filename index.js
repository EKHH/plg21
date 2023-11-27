(function (R, C, s, c, f, u, d, S, b) {
    "use strict";
    const {
        Permissions: T
    } = c.constants, {
        computePermissions: N
    } = s.findByProps("computePermissions", "canEveryoneRole"), _ = s.findByStoreName("GuildMemberStore"), E = [c.i18n.Messages.AI_TAG, c.i18n.Messages.BOT_TAG_SERVER, c.i18n.Messages.SYSTEM_DM_TAG_SYSTEM, c.i18n.Messages.GUILD_AUTOMOD_USER_BADGE_TEXT, c.i18n.Messages.REMIXING_TAG], G = [{
        text: "WHK",
        condition: function (t, e, n) {
            return n.isNonUserBot()
        }
    }, {
        text: "OWN",
        backgroundColor: u.rawColors.ORANGE_345,
        condition: function (t, e, n) {
            return t?.ownerId === n.id
        }
    }, {
        text: c.i18n.Messages.BOT_TAG_BOT,
        condition: function (t, e, n) {
            return n.bot
        },
        verified: function (t, e, n) {
            return n.isVerifiedBot()
        }
    }, {
        text: "ADM",
        backgroundColor: u.rawColors.RED_560,
        permissions: ["ADMINISTRATOR"]
    }, {
        text: "MGR",
        backgroundColor: u.rawColors.GREEN_345,
        permissions: ["MANAGE_GUILD", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_WEBHOOKS"]
    }, {
        text: "MOD",
        backgroundColor: u.rawColors.BLUE_345,
        permissions: ["MANAGE_MESSAGES", "KICK_MEMBERS", "BAN_MEMBERS"]
    }];

    function B(t, e, n) {
        let a;
        if (t) {
            const r = N({
                user: n,
                context: t,
                overwrites: e?.permissionOverwrites
            });
            a = Object.entries(T).map(function (o) {
                let [i, l] = o;
                return r & l ? i : ""
            }).filter(Boolean)
        }
        for (const r of G)
            if (r.condition?.(t, e, n) || r.permissions?.some(function (o) {
                    return a?.includes(o)
                })) {
                let o = C.storage.useRoleColor ? _.getMember(t?.id, n.id)?.colorString : void 0,
                    i = o || (r.backgroundColor ?? u.rawColors.BRAND_500),
                    l = o || !r.textColor ? c.chroma(i).get("lab.l") < 70 ? u.rawColors.WHITE_500 : u.rawColors.BLACK_500 : r.textColor;
                return {
                    ...r,
                    textColor: l,
                    backgroundColor: i,
                    verified: typeof r.verified == "function" ? r.verified(t, e, n) : r.verified ?? !1,
                    condition: void 0,
                    permissions: void 0
                }
            }
    }
    const A = s.findByName("getTagProperties", !1),
        M = s.findByStoreName("GuildStore"),
        I = s.findByStoreName("ChannelStore");

    function w() {
        return f.after("default", A, function (t, e) {
            let [{
                message: n
            }] = t;
            if (!E.includes(e.tagText)) {
                const a = I.getChannel(n.channel_id),
                    r = M.getGuild(a?.guild_id),
                    o = B(r, a, n.author);
                if (o) return {
                    ...e,
                    tagText: o.text,
                    tagTextColor: o.textColor ? c.ReactNative.processColor(c.chroma(o.textColor).hex()) : void 0,
                    tagBackgroundColor: o.backgroundColor ? c.ReactNative.processColor(c.chroma(o.backgroundColor).hex()) : void 0,
                    tagVerified: o.verified,
                    tagType: void 0
                }
            }
        })
    }
    const x = s.findByProps("getBotLabel"),
        k = x.getBotLabel,
        m = s.findByStoreName("GuildStore"),
        O = function (t, e) {
            let [{
                guildId: n,
                user: a
            }] = t;
            console.log(e);
            const r = d.findInReactTree(e.props.label, function (o) {
                return o.type.Types
            });
            if (!r || !E.includes(k(r.props.type))) {
                const o = m.getGuild(n),
                    i = B(o, void 0, a);
                if (i)
                    if (r) r.props = {
                        type: 0,
                        ...i
                    };
                    else {
                        const l = d.findInReactTree(e.props.label, function (y) {
                            return y.props?.lineClamp
                        }).props.children;
                        l.props.children[1] = React.createElement(React.Fragment, null, " ", React.createElement(x.default, {
                            type: 0,
                            text: i.text,
                            textColor: i.textColor,
                            backgroundColor: i.backgroundColor,
                            verified: i.verified
                        }))
                    }
            }
        };

    function L() {
        const t = [];
        return s.findByTypeNameAll("UserRow").forEach(function (e) {
                return t.push(f.after("type", e, O))
            }),
            function () {
                return t.forEach(function (e) {
                    return e()
                })
            }
    }
    const D = s.findByName("DisplayName", !1),
        P = s.findByName("HeaderName", !1),
        h = s.findByProps("getBotLabel"),
        U = h.getBotLabel,
        $ = s.findByStoreName("GuildStore"),
        H = s.findByStoreName("ChannelStore");

    function K() {
        const t = [];
        return t.push(f.after("default", P, function (e, n) {
                let [{
                    channelId: a
                }] = e;
                n.props.channelId = a
            })), t.push(f.after("default", D, function (e, n) {
                let [{
                    guildId: a,
                    channelId: r,
                    user: o
                }] = e;
                const i = d.findInReactTree(n, function (l) {
                    return l.type.Types
                });
                if (!i || !E.includes(U(i.props.type))) {
                    const l = $.getGuild(a),
                        y = H.getChannel(r),
                        g = B(l, y, o);
                    g && (i ? i.props = {
                        type: 0,
                        ...g
                    } : d.findInReactTree(n, function (ee) {
                        return ee.props.style.flexDirection === "row"
                    }).props.children.push(React.createElement(h.default, {
                        style: {
                            marginLeft: 0
                        },
                        type: 0,
                        text: g.text,
                        textColor: g.textColor,
                        backgroundColor: g.backgroundColor,
                        verified: g.verified
                    })))
                }
            })),
            function () {
                return t.forEach(function (e) {
                    return e()
                })
            }
    }
    const V = s.findByProps("GuildMemberRow"),
        v = s.findByProps("getBotLabel"),
        F = v.getBotLabel,
        W = s.findByStoreName("GuildStore");

    function j() {
        return f.after("type", V.GuildMemberRow, function (t, e) {
            let [{
                guildId: n,
                channel: a,
                user: r
            }] = t;
            const o = d.findInReactTree(e, function (i) {
                return i.type.Types
            });
            if (!o || !E.includes(F(o.props.type))) {
                const i = W.getGuild(n),
                    l = B(i, a, r);
                l && (o ? o.props = {
                    type: 0,
                    ...l
                } : d.findInReactTree(e, function (y) {
                    return y.props.style.flexDirection === "row"
                }).props.children.splice(2, 0, React.createElement(v.default, {
                    type: 0,
                    text: l.text,
                    textColor: l.textColor,
                    backgroundColor: l.backgroundColor,
                    verified: l.verified
                })))
            }
        })
    }
    const X = s.findByProps("getBotLabel");

    function Y() {
        return f.after("default", X, function (t, e) {
            let [{
                text: n,
                textColor: a,
                backgroundColor: r
            }] = t;
            const o = d.findInReactTree(e, function (i) {
                return typeof i.props.children == "string"
            });
            n && (o.props.children = n), a && o.props.style.push({
                color: a
            }), r && e.props.style.push({
                backgroundColor: r
            })
        })
    }
    const {
        ScrollView: q
    } = b.General, {
        FormSection: z,
        FormSwitchRow: J
    } = b.Forms;

    function Q() {
        return S.useProxy(C.storage), React.createElement(q, {
            style: {
                flex: 1
            }
        }, React.createElement(z, {
            title: "Tag style"
        }, React.createElement(J, {
            label: "Use top role color for tag backgrounds",
            value: C.storage.useRoleColor,
            onValueChange: function (t) {
                C.storage.useRoleColor = t
            }
        })))
    }
    let p = [];
    var Z = {
        onLoad: function () {
            C.storage.useRoleColor ?? = !1, p.push(w()), p.push(Y()), p.push(K()), p.push(j()), p.push(L())
        },
        onUnload: function () {
            return p.forEach(function (t) {
                return t()
            })
        },
        settings: Q
    };
    return R.default = Z, Object.defineProperty(R, "__esModule", {
        value: !0
    }), R
})({}, vendetta.plugin, vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.ui, vendetta.utils, vendetta.storage, vendetta.ui.components);