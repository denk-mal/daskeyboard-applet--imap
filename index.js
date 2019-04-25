const q = require('daskeyboard-applet');
const childprocess = require('child_process');
const imaps = require('imap-simple');
const logger = q.logger;

var config = {
    imap: {
        // server connection params
        // host: 'mail.example.invalid',
        // user: 'user',
        // password: '************',   // scnr
        port: 993,
        tls: true,
        // search criterias
        // box: "INBOX",
        search: ["UNSEEN"],
        // fetch options
        bodies: ['HEADER', 'TEXT'],
        markSeen: false,
        // maybe usefull??
        fetchUnreadOnStart: true,
    }
};

async function check_imapaccount(config_in) {
    var unseen_messages_cnt = -1;
    config.imap.host      = config_in.imapserver;
    config.imap.user      = config_in.username;
    config.imap.password  = config_in.password;
    config.imap.box       = config_in.boxname ? config_in.boxname : "INBOX";
    await imaps.connect(config).then(async function (connection) {
        return await connection.openBox(config.imap.box, openReadOnly=true).then(async function () {
            var result = await connection.search(config.imap.search, config.imap).then(function (results) {
                unseen_messages_cnt = results.length;
                connection.end();
            });
        });
    });
  	if (unseen_messages_cnt === -1) {
  		  logger.warn('Error while executing check_imapaccount');
  		  return reject(stderr);
  	};
    return unseen_messages_cnt;
}

class CheckIMAP extends q.DesktopApp {
    constructor() {
        super();
        this.pollingInterval = 60000;
    }

    async run() {
        const state = 0;
        return this.getConfig()
            .then(config => check_imapaccount(config))
            .then(response => this.buildSignal(this.getStatusColor(response), response))
            .catch(error => this.buildSignal(this.getOffColor(error), error));
    }

    async applyConfig() {
        return this.getConfig()
            .then(config => check_imapaccount(config))
            .then(response => response === 1)
            .catch(error => {
                logger.warn(error);
                return false;
            });
    }

    getConfig() {
        this.pollingInterval = this.config.check_interval
            ? this.config.check_interval * 1000
            : 60000
        return this.config
            ? Promise.resolve(this.config)
            : Promise.reject()
    }

    getOnColor() {
        return this.config.onColor
            ? this.config.onColor
            : "#FF0000";
    }

    getOffColor() {
        return this.config.offColor
            ? this.config.offColor
            : "#000000";
    }

    getStatusColor(msg_cnt) {
        return msg_cnt === 0
            ? this.getOffColor()
            : this.getOnColor();
    }

    buildSignal(color, msg_cnt) {
        const effect = msg_cnt !== 0 ? this.config.reminderEffect : q.Effects.NONE;
        const folder = this.config.boxname ? this.config.boxname : "INBOX";
        return new q.Signal({
            points: [
                [new q.Point(color, effect)]
            ],
            name:     `unread: ${msg_cnt}`,
            message:  `There are ${msg_cnt} unread Messages in folder '${folder}'` ,
            isMuted:  msg_cnt ? false : true,
        });
    }
}

module.exports = {
    CheckIMAP: CheckIMAP
};

const checkIMAP = new CheckIMAP();
