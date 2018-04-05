const Discord = require('discord.js');
const TOKEN = "NDA0NzAyMzMwODMyMDI3NjQ4.DUZr8A.1R-On9BAHH9NyXy5fwSOo_RQS1Q";
const PREFIX = "!";
const request = require('request');

var bot = new Discord.Client();
const sql = require("sqlite");
sql.open("./jd.sqlite");
require('events').EventEmitter.prototype._maxListeners = 0;

var members = [];
var chach = [];
var available = [];

bot.on("ready", function() {
    console.log("Bot Started");
    bot.user.setActivity("https://jenkinsdesigns.com", {type: "WATCHING"});
});

bot.on("guildMemberAdd", function(member) {
    var botlogs2 = member.guild.channels.find("name", "log");
    const embed2 = new Discord.RichEmbed()
    .setColor(0x2C8CFC)
    .setThumbnail("https://jenkinsdesigns.com/img/JD-White.png")
    .setTimestamp()
    .addField("Member Join", `${member}`)
    botlogs2.send({embed: embed2});
    var botlogs = member.guild.channels.find("name", "welcome");
    const embed = new Discord.RichEmbed()
    .setColor(0x2C8CFC)
    .setThumbnail("https://jenkinsdesigns.com/img/JD-White.png")
    .setTimestamp()
    .addField("Welcome", `Bang! Ground to Apollo 13, you have landed.

G'day ${member}, you have landed in the JenkinsDesigns server. Listen carefully, as it could be dangerous out there. When you exit this channel there are some codes/commands that are vital for you to know. Please read the codes below and memorise them as you may not be coming back here for a while.

!quote - Opens a private channel where you can discuss your order, and receive a price.
!support - Opens a private channel for you to discuss an issue/error that you have encountered.
!close - Close the quote channel.
!paypalconversion (amount) - Check how much you will be paying inc VAT.

We hope you have a good time here at JenkinsDesigns. If you need anything, message one of our management team (They will help day or night).

Have a good one partner.`)
    botlogs.send({embed});
    member.addRole(member.guild.roles.find("name", "Member"));
});

bot.on("guildMemberRemove", function(member) {
  var botlogs = member.guild.channels.find("name", "log");
  const embed = new Discord.RichEmbed()
  .setColor(0xFF4056)
  .setThumbnail("https://jenkinsdesigns.com/img/JD-White.png")
  .setTimestamp()
  .addField("Member Leave", `${member}`)
  botlogs.send({embed});
});

bot.on("messageDelete", function(message) {
  if (message.author.equals(bot.user)) return;
  var botlogs = message.guild.channels.find("name", "log");
  try {
    const embed = new Discord.RichEmbed()
    .setColor(0xFF4056)
    .setTitle("**MESSAGE DELETE**")
    .setTimestamp()
    .addField("Content", `${message.content}`)
    .addField("Author", `${message.author}`)
    botlogs.send({embed});
  } catch (e) {
  }
});

bot.on("messageUpdate", function(oldMessage, newMessage) {
  var botlogs = oldMessage.guild.channels.find("name", "log");
  try {
    const embed = new Discord.RichEmbed()
    .setColor(0xE3CD40)
    .setTitle("**MESSAGE UPDATE**")
    .setTimestamp()
    .addField("Old", `${oldMessage.content}`)
    .addField("New", `${newMessage.content}`)
    .addField("Author", `${oldMessage.author}`)
    botlogs.send({embed});
  } catch (e) {
  }
});

var log = true;


bot.on("message", function(message) {

    if (message.author.equals(bot.user)) return;

    if (log == "true") {
      if (message.channel.id != '358558307008643072') {
        console.log("Trying to log");
        var d = new Date();
        var url = `https://jenkinsdesigns.com/api/logmessage.php?userid=${message.author.id}&username=${message.author.username}&channelid=${message.channel.id}&channelname=${message.channel.name}&timestamp=${d.toUTCString()}&content=${message.content}&messageid=${message.id}&categoryid=${message.channel.parentID}&categoryname=${message.channel.parent.name}`;
        request(url, function(err, response, body) {
            if(err) {
                console.log(err);
                console.log("didn't log");
            }
            body = JSON.parse(body);
            if (body.success == "true") {
              console.log("Logged message " + message.id);
            }
        });
      } else {
        console.log("Not trying");
      }
    }

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");


    switch (args[0].toLowerCase()) {
      case "pm":
        var user = "";
        var content = "";
        if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id)) {
          const collector = new Discord.MessageCollector(message.channel, m => m.author.id != bot.user.id, { time: 900000 });
          message.channel.send(`Please tag the user you would like to PM. Or do @Username#Desc`);
          collector.on('collect', message => {
            if (message.content.length > 1) {
              user = message.mentions.users.first();
              collector.stop();
              const collector2 = new Discord.MessageCollector(message.channel, m => m.author.id != bot.user.id, { time: 900000 });
              message.channel.send(`Thanks, now what would you like this message to say?`);
              collector2.on('collect', message => {
                if (message.content.length > 1) {
                  message.reply("Great thanks!");
                  content = message.content;
                  collector2.stop();
                  user.sendMessage(content);

                  message.reply("I've messaged them!")
                }
              });
            }
          });
        } else {
          message.reply("You do not have permission to do this!");
        }
        break;
      case "website":
          message.reply("You can access the JenkinsDesigns website here: https://jenkinsdesigns.com");
        break;
      case "invites":
        message.guild.fetchInvites()
        .then(invites => message.reply("You currently have " + invites.find(invite => invite.inviter.id === message.author.id).uses + " invites."))
        .catch(error => console.log(error));

        break;
      case "help":
        const embed = new Discord.RichEmbed()
        .setColor(0x2C8CFC)
        .setThumbnail("https://jenkinsdesigns.com/img/JD-White.png")
        .setTimestamp()
        .addField("Help Menu", `Hello ${message.author}! I see you are looking for help? If this menu doesn't help you please don't hesitate to contact a support rep by doing !support.`)
        .addField("Commands", `--`)
        .addField("!quote", `This will open a quote channel where you can get a quote on something you are looking for and then we can then change this to an order channel once we've found you a freelancer and you two have worked out all the details.`)
        .addField("!support", `This will open a support ticket where you can speak to our support team about any questions or problems you are having.`)
        .addField("!setrep (@User)", `This remove all other reps from a support ticket, quote, or order.`)
        .addField("!status", `This will let you know the current status of your support ticket, quote, or order.`)
        .addField("!paypalconversion (Amount)", `This will return the paypal fees on top of what you are paying for the order as we use G&S here at JenkinsDesigns.`)
        .addField("!managercut (Amount)", `This will return the amount that our managament team will get off of the price specified.`)
        .addField("!website", `This send you a link to our website.`)
        .addField("!invites", `This show you how many people you have invited to our discord server. You must create a custom invite link at the top left where it says "JenkinsDesigns"`)
        message.channel.send({embed});
        break;
      case "addcommission":
        if (args.length != 2) {
          message.reply("Please use the format !addcommission @User");
        } else {
          if (args[1].includes("@")) {
            var user = message.mentions.users.first();
            const salesrep = message.author.id;
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
            message.channel.send(`Hello, ${user}! We need to grab some info on this order! The first question is what is your budget? (At any time you can type !cancel and it will stop this.)`);
            collector.on('collect', message => {
                var args = message.content.split(" ");
                const budget = args.join(" ");
                if (message.content.toLowerCase().includes("!cancel")) {
                  collector.stop();
                  message.reply("Canceled.")
                  return;
                }
                collector.stop();
                const collector2 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                message.channel.send(`Perfecto thanks! Now could you please type which category you are looking for. Categories are: Design (This is for front end web development as well), Developer (This is for all development apart from front end web development, for backend web development please choose this), Building, and Setups.`);
                collector2.on('collect', message => {
                    var args = message.content.split(" ");
                    const role = args[0];
                    if (message.content.toLowerCase().includes("cancel")) {
                      collector2.stop();
                      message.reply("Canceled.")
                      return;
                    }
                    if (role.toLowerCase() == "design") {
                      const frole = message.guild.roles.find('name', "Design").id;
                      console.log(frole);
                      if (message.content.toLowerCase().includes("cancel")) {
                        collector2.stop();
                        message.reply("Canceled.")
                        return;
                      }
                      collector2.stop();
                      const collector3 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                      message.channel.send(`Almost there! Now could you put your timeframe? For example 3 days or ASAP`);
                      collector3.on('collect', message => {
                          var args = message.content.split(" ");
                          const timeframe = args.join(" ");
                          if (message.content.toLowerCase().includes("cancel")) {
                            collector3.stop();
                            message.reply("Canceled.")
                            return;
                          }
                          collector3.stop();
                          const collector4 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                          message.channel.send(`and the last question.. Could you please explain what you are looking for in detail?`);
                          collector4.on('collect', message => {
                              var args = message.content.split(" ");
                              const desc = args.join(" ");
                              if (message.content.toLowerCase().includes("cancel")) {
                                collector4.stop();
                                message.reply("Canceled.")
                                return;
                              }
                              collector4.stop();
                              const collector5 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                              var rolem = message.guild.roles.find('id', frole);
                              message.channel.send(`Awesome thanks! Now could you please confirm all these details:\nBudget: ${"``" + budget + "``"}\nCategory: ${"``" + rolem.name + "``"}\nTimeframe: ${"``" + timeframe + "``"}\nDescription: ${"``" + desc + "``"}\nTo send these over to management please respond saying "Correct"`);
                              collector5.on('collect', message => {
                                  var args = message.content.split(" ");
                                  const agree = args.join(" ");
                                  if (message.content.toLowerCase().includes("cancel")) {
                                    collector5.stop();
                                    message.reply("Canceled.")
                                    return;
                                  }
                                  if (agree.toLowerCase().includes("correct")) {
                                    collector5.stop();
                                    message.reply("Awesome thanks!");
                                  } else {
                                    message.reply(`Please reply with Correct to send these details over. If you need to change anything please do !cancel and have the Sales Representative redo the commission.`);
                                  }
                              });
                          });
                      });
                    } else if (role.toLowerCase() == "developer") {
                      const frole = message.guild.roles.find('name', "Developer").id;
                      console.log(frole);
                      collector2.stop();
                      const collector3 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                      message.channel.send(`Almost there! Now could you put your timeframe? For example 3 days or ASAP`);
                      collector3.on('collect', message => {
                          var args = message.content.split(" ");
                          const timeframe = args.join(" ");
                          if (message.content.toLowerCase().includes("cancel")) {
                            collector3.stop();
                            message.reply("Canceled.")
                            return;
                          }
                          collector3.stop();
                          const collector4 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                          message.channel.send(`and the last question.. Could you please explain what you are looking for in detail?`);
                          collector4.on('collect', message => {
                              var args = message.content.split(" ");
                              const desc = args.join(" ");
                              collector4.stop();
                              message.channel.send(budget + " " + frole + " " + timeframe + " " + desc + " ");
                          });
                      });
                    } else if (role.toLowerCase() == "building") {
                      const frole = message.guild.roles.find('name', "Building").id;
                      console.log(frole);
                      collector2.stop();
                      const collector3 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                      message.channel.send(`Almost there! Now could you put your timeframe? For example 3 days or ASAP`);
                      collector3.on('collect', message => {
                          var args = message.content.split(" ");
                          const timeframe = args.join(" ");
                          if (message.content.toLowerCase().includes("cancel")) {
                            collector3.stop();
                            message.reply("Canceled.")
                            return;
                          }
                          collector3.stop();
                          const collector4 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                          message.channel.send(`and the last question.. Could you please explain what you are looking for in detail?`);
                          collector4.on('collect', message => {
                              var args = message.content.split(" ");
                              const desc = args.join(" ");
                              collector4.stop();
                              message.channel.send(budget + " " + frole + " " + timeframe + " " + desc + " ");
                          });
                      });
                    } else if (role.toLowerCase() == "setups") {
                      const frole = message.guild.roles.find('name', "Setups").id;
                      console.log(frole);
                      collector2.stop();
                      const collector3 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                      message.channel.send(`Almost there! Now could you put your timeframe? For example 3 days or ASAP`);
                      collector3.on('collect', message => {
                          var args = message.content.split(" ");
                          const timeframe = args.join(" ");
                          if (message.content.toLowerCase().includes("cancel")) {
                            collector3.stop();
                            message.reply("Canceled.")
                            return;
                          }
                          collector3.stop();
                          const collector4 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                          message.channel.send(`and the last question.. Could you please explain what you are looking for in detail?`);
                          collector4.on('collect', message => {
                              var args = message.content.split(" ");
                              const desc = args.join(" ");
                              collector4.stop();
                              message.channel.send(budget + " " + frole + " " + timeframe + " " + desc + " ");
                          });
                      });
                    } else {
                      message.channel.send("Sorry that role isn't in the list. Please choose a role from the list. Remember at anytime you can type !cancel.")
                      var suc = false;
                    }
                });
            });
          } else {
            message.reply("Please use the format !addcommission @User");
          }
        }
        break;
      case "commissiondatabase":
        sql.run("CREATE TABLE IF NOT EXISTS commissions (reqID TEXT, staffID TEXT, roleID TEXT, budget TEXT, timeframe TEXT, desc TEXT, channelID TEXT, messageID, claimed TEXT, claimedBy TEXT, createdOn TEXT, claimedOn TEXT)").then(() => {
          message.react('👍');
          message.reply("created table with the following columns: reqID, staffID, roleID, budget, timeframe, desc, channelID, messageID, claimed, claimedBY, createdOn, and claimedOn");
        });
        break;
      case "message":
        if (args[1] != null) {
          message.channel.send(args.join(" ").slice(8));
        } else {
          message.reply("You must use !message (Message)");
        }
        break;
      case "checkaccepting":
        if (message.member.roles.has(message.guild.roles.find('name', 'Freelancer').id)) {
          if (args[1] != null) {
            var user = message.mentions.users.first();
            if (user == null) {
              message.reply("you must do !checkaccepting (User)");
              return;
            }
            sql.get(`SELECT * FROM available WHERE userID = "${user.id}"`).then(row => {
              console.log(row);
              if (row.available == "yes") {
                message.reply("that user is accepting commissions!");
              } else {
                message.reply("that user is not accepting commissions!");
              }
            }).catch(() => {
              console.error;
              message.reply("that user has not specifed a status!");
            });
          } else {
            message.reply("you must do !checkaccepting (User)");
          }
        } else {
          message.reply("you do not have permission to do this!");
        }
        break;
      case "accepting":
        if (message.member.roles.has(message.guild.roles.find('name', 'Freelancer').id)) {
          sql.get(`SELECT * FROM available WHERE userID = "${message.author.id}"`).then(row => {
            if (row.available == 'yes') {
              message.reply("you are already set as accepting!");
            } else {
              sql.run(`UPDATE available SET available = "yes" WHERE userId = ${message.author.id}`);
              message.reply("set you as accepting!")
            }
          }).catch(() => {
            console.error;
            sql.run(`INSERT INTO available (userID, available) VALUES ('${message.author.id}', 'yes')`);
            message.reply("set you as accepting!")
          });
        } else {
          message.reply("you do not have permission to do this!");
        }
        break;
      case "notaccepting":
        if (message.member.roles.has(message.guild.roles.find('name', 'Freelancer').id)) {
          sql.get(`SELECT * FROM available WHERE userID = "${message.author.id}"`).then(row => {
            if (row.available == 'no') {
              message.reply("you are already set as not accepting!");
            } else {
              sql.run(`UPDATE available SET available = "no" WHERE userId = ${message.author.id}`);
              message.reply("set you as not accepting!")
            }
          }).catch(() => {
            console.error;
            sql.run(`INSERT INTO available (userID, available) VALUES ('${message.author.id}', 'no')`);
            message.reply("set you as not accepting!")
          });
        } else {
          message.reply("you do not have permission to do this!");
        }
        break;
      case "announcementtag":
        if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id)) {
          const collector = new Discord.MessageCollector(message.channel, m => m.author.id != bot.user.id, { time: 900000 });
          message.channel.send(`Please send the message in this channel with formatting.`);
          collector.on('collect', message => {
            if (message.content.length > 1) {
              message.reply("Thanks!")
              message.guild.channels.find('id', '409363771090534401').send("@everyone").then(msg => msg.delete());
              message.guild.channels.find('id', '409363771090534401').send({embed: {
                color: 0x2C8CFC,
                description: message.content
              }});
              collector.stop();
            }
          });
        } else {
          message.reply("You do not have permission to do this!");
        }
        break;
      case "announcement":
          if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id)) {
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id != bot.user.id, { time: 900000 });
            message.channel.send(`Please send the message in this channel with formatting.`);
            collector.on('collect', message => {
              if (message.content.length > 1) {
                message.reply("Thanks!")
                message.guild.channels.find('id', '409363771090534401').send({embed: {
                  color: 0x2C8CFC,
                  description: message.content
                }});
                collector.stop();
              }
            });
          } else {
            message.reply("You do not have permission to do this!");
          }
          break;
      case "status":
        if (message.channel.type != 'dm') {
          if (message.channel.name.toLowerCase().includes("quote-") || message.channel.name.toLowerCase().includes("order-")) {
            message.reply("The current status is " + message.channel.topic.slice(10));
          } else {
            message.reply("This command can only be used in quote and order channels!");
          }
        } else {
          message.reply("This can not be done in DM!");
        }
        break;
      case "setstatus":
        if (message.channel.type != 'dm') {
          if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id)  || message.member.roles.has(message.guild.roles.find('name', 'Sales Representative').id) || message.member.roles.has(message.guild.roles.find('name', 'Freelancer').id)) {
            if (args[1] != null) {
                if (message.channel.name.toLowerCase().includes("quote-") || message.channel.name.toLowerCase().includes("order-")) {
                  message.channel.setTopic("*Status*: " + args.join(" ").slice(10));
                  message.reply("Status set.");
                } else {
                  message.reply("This command can only be used in quote and order channels!");
                }
            } else {
              message.reply("Please use !setstatus (Status)");
            }
          } else {
            message.reply("You do not have permission to do this!");
          }
        } else {
          message.reply("This can not be done in DM!");
        }
        break;

      case "getinfo":
        if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id) || message.member.roles.has(message.guild.roles.find('name', 'Sales Representative').id)) {
          if (args[1] != null) {
            var user = message.mentions.users.first();
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
            message.channel.send(`Hello, ${user}! We need to get some information from you so we can continue with this order! First could you please send your email in this chat. (This should be the same as your paypal email)`);
            collector.on('collect', message => {
              if (message.content.includes("@")) {
                var args = message.content.split(" ");
                const email = args.join(" ");
                collector.stop();
                const collector2 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                message.channel.send(`Great! Now do you mind sending your MCM account username? If you don't have one please just send N/A`);
                collector2.on('collect', message => {
                  if (message.content.length > 1) {
                    var args = message.content.split(" ");
                    const mcm = args.join(" ");
                    collector2.stop();
                    const collector3 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                    message.channel.send(`Look'n good! Now could you please send your paypal **name**`);
                    collector3.on('collect', message => {
                      if (message.content.length > 1) {
                        var args = message.content.split(" ");
                        const paypalname = args.join(" ");
                        collector3.stop();
                        const collector4 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                        message.channel.send(`Perfect! We are almost there! Now please send your discord Name and Identifier, in this format: Name#Identifier`);
                        collector4.on('collect', message => {
                          if (message.content.length > 1) {
                            var args = message.content.split(" ");
                            const discord = args.join(" ");
                            collector4.stop();
                            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                            message.channel.send(`Last one! Can you please read our Terms of service here: https://jenkinsdesigns.com/terms.php and reply to this message with "I agree" if you agree?\n**Please note by typing this message you will be held accountable to following the tos.**`).then(msg => msg.pin());
                            collector.on('collect', message => {
                              if (message.content.toLowerCase().includes("i agree")) {
                                const agreed = "Yes";
                                message.pin();
                                message.channel.send("Awesome! Thank you so much! We can now continue with the order!");
                                collector.stop();
                                var botlogs = message.guild.channels.find("id", "416990705622188063");
                                botlogs.send({embed: {
                                    color: 0x2C8CFC,
                                    title: "**NEW CLIENT INFO**",
                                    fields: [{
                                        name: "Email",
                                        value: email
                                      },
                                      {
                                        name: "MCM Account",
                                        value: mcm
                                      },
                                      {
                                          name: "Paypal Name",
                                          value: paypalname
                                      },
                                      {
                                          name: "Discord Name",
                                          value: discord
                                      },
                                      {
                                          name: "TOS",
                                          value: agreed
                                      }
                                    ],
                                    timestamp: new Date(),
                                    footer: {
                                      icon_url: bot.user.avatarURL,
                                      text: "© JenkinsDesigns"
                                    }
                                  }
                              });
                            } else if (message.content.toLowerCase().includes("cancel")) {
                                collector.stop();
                                message.channel.send("Canceled.");
                            } else {
                              const agreed = "No";
                              message.channel.send("You must agree to the TOS to work with JenkinsDesigns. Please reply with I agree. If you would like to cancel this process please type 'Cancel'.");
                            }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              } else {
                message.reply("Please use the format username@provider");
              }
            });
          } else {
            message.reply("Please do !getinfo (User)");
          }
        } else {
          message.reply("You do not have permission to do this!");
        }
        break;
        case "newstaff":
          if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id)) {
            if (args[1] != null) {
              var user = message.mentions.users.first();
              const collector = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
              message.channel.send(`Hello, ${user}! Welcome to the team! I need to get some information from you so that you can work with us! First could you please send your email in this chat. (This should be the same as your paypal email)`);
              collector.on('collect', message => {
                if (message.content.includes("@")) {
                  var args = message.content.split(" ");
                  const email = args.join(" ");
                  collector.stop();
                  const collector2 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                  message.channel.send(`Great! Now do you mind sending your MCM account username? If you don't have one please just send N/A`);
                  collector2.on('collect', message => {
                    if (message.content.length > 1) {
                      var args = message.content.split(" ");
                      const mcm = args.join(" ");
                      collector2.stop();
                      const collector3 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                      message.channel.send(`Look'n good! Now could you please send your paypal **name**`);
                      collector3.on('collect', message => {
                        if (message.content.length > 1) {
                          var args = message.content.split(" ");
                          const paypalname = args.join(" ");
                          collector3.stop();
                          const collector4 = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                          message.channel.send(`Perfect! We are almost there! Now please send your discord Name and Identifier, in this format: Name#Identifier`);
                          collector4.on('collect', message => {
                            if (message.content.length > 1) {
                              var args = message.content.split(" ");
                              const discord = args.join(" ");
                              collector4.stop();
                              const collector = new Discord.MessageCollector(message.channel, m => m.author.id === user.id, { time: 900000 });
                              message.channel.send(`Last one! Can you please read our Terms of service here: https://jenkinsdesigns.com/terms.php and reply to this message with "I agree" if you agree?\n**Please note by typing this message you will be held accountable to following the tos.**`).then(msg => msg.pin());
                              collector.on('collect', message => {
                                if (message.content.toLowerCase().includes("i agree")) {
                                  const agreed = "Yes";
                                  message.pin();
                                  message.channel.send("Awesome! Thank you so much! Welcome to the team :P");
                                  collector.stop();
                                  var botlogs = message.guild.channels.find("id", "417714438565789706");
                                  botlogs.send({embed: {
                                      color: 0x2C8CFC,
                                      title: "**NEW STAFF INFO**",
                                      fields: [{
                                          name: "Email",
                                          value: email
                                        },
                                        {
                                          name: "MCM Account",
                                          value: mcm
                                        },
                                        {
                                            name: "Paypal Name",
                                            value: paypalname
                                        },
                                        {
                                            name: "Discord Name",
                                            value: discord
                                        },
                                        {
                                            name: "TOS",
                                            value: agreed
                                        }
                                      ],
                                      timestamp: new Date(),
                                      footer: {
                                        icon_url: bot.user.avatarURL,
                                        text: "© JenkinsDesigns"
                                      }
                                    }
                                });
                              } else if (message.content.toLowerCase().includes("cancel")) {
                                  collector.stop();
                                  message.channel.send("Canceled.");
                              } else {
                                const agreed = "No";
                                message.channel.send("You must agree to the TOS to work at JenkinsDesigns. Please reply with I agree. If you would like to cancel this process please type 'Cancel'.");
                              }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                } else {
                  message.reply("Please use the format username@provider");
                }
              });
            } else {
              message.reply("Please do !newstaff (User)");
            }
          } else {
            message.reply("You do not have permission to do this!");
          }
          break;
      case "add":
        if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id) || message.member.roles.has(message.guild.roles.find('name', 'Sales Representative').id)) {
          if (args[1] != null) {
            var person = message.mentions.users.first();
            message.channel.overwritePermissions(person, {
              READ_MESSAGES: true
            }).then(() => message.channel.send(person + ", has been added to this channel.")).catch(console.error);
          } else {
            message.reply("Please do !add @Name#Number");
          }
        } else {
          message.reply("You do not have permission to do this!");
        }
        break;
      case "updatechannels":
        if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id)) {
            message.guild.channels.forEach(function(channel) {
            if (channel.name.includes("quote") || channel.name.includes("order") || channel.name.includes("support")) {
              message.channel.overwritePermissions(message.guild.roles.find('name', "Sales Representative"), {
                READ_MESSAGES: true
              }).then(() => message.channel.send("Added to channel " + channel)).catch(console.error);
            }
            });
        } else {
          message.reply("You do not have permission to do this!");
        }
        break;
      case "remove":
          if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id) || message.member.roles.has(message.guild.roles.find('name', 'Sales Representative').id)) {
            if (args[1] != null) {
              var person = message.mentions.users.first();
              message.channel.overwritePermissions(person, {
                READ_MESSAGES: false
              }).then(() => message.channel.send(person + ", has been removed to this channel.")).catch(console.error);
            } else {
              message.reply("Please do !remove @Name#Number");
            }
          } else {
            message.reply("You do not have permission to do this!");
          }
          break;
     case "rep":
        if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id) || message.member.roles.has(message.guild.roles.find('name', 'Sales Representative').id)) {
          message.channel.overwritePermissions(message.author, {
            READ_MESSAGES: true
          });
          message.channel.overwritePermissions(message.guild.roles.find("name", "Sales Representative"), {
            READ_MESSAGES: false
          }).then(() => message.channel.send("All other reps have been removed from this channel.")).catch(console.error);
        } else {
          message.reply("You do not have permission to do this!");
        }
        break;
      case "setrep":
         if (message.mentions.users.first() != null) {
           if (!message.channel.name.toLowerCase().includes("support-") && !message.channel.name.toLowerCase().includes("quote-") && !message.channel.name.toLowerCase().includes("quote-")) {
             message.reply("You can only do this in quote, order, and support channels.")
             return true;
           }
           message.channel.overwritePermissions(message.mentions.users.first(), {
             READ_MESSAGES: true
           });
           message.channel.overwritePermissions(message.guild.roles.find("name", "Sales Representative"), {
             READ_MESSAGES: false
           }).then(() => message.channel.send("All other reps have been removed from this channel.")).catch(console.error);
         } else {
           message.reply("Please do !setrep @(User)");
         }
         break;
        case "addreps":
           if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id) || message.member.roles.has(message.guild.roles.find('name', 'Sales Representative').id)) {
             message.channel.overwritePermissions(message.guild.roles.find("name", "Sales Representative"), {
               READ_MESSAGES: true
             }).then(() => message.channel.send("All other reps have been added to this channel.")).catch(console.error);
           } else {
             message.reply("You do not have permission to do this!");
           }
         break;
        case "archive":
          if (message.channel.type != 'dm') {
            if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id) || message.member.roles.has(message.guild.roles.find('name', 'Sales Representative').id)) {
              if (2 > 1) {
                if (message.channel.name.toLowerCase().includes("support-")) {
                  var num = 9;
                }
                if (message.channel.name.toLowerCase().includes("quote-")) {
                  var num = 7;
                }
                if (message.channel.name.toLowerCase().includes("order-")) {
                  var num = 7;
                }
                message.reply("Are you sure that you would like to archive this? (Send the thumbs up emoji in this channel) This will expire in 30 seconds.").then(msg => {msg.delete(30000)}).catch();
                const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 30000 });
                collector.on('collect', message => {
                  if (message.content == "👍") {
                      message.channel.sendMessage(`${message.author}, Changing in 5 seconds..`);
                      setTimeout(function(){
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth()+1;

                        var yyyy = today.getFullYear();
                        if(dd<10){
                            dd='0'+dd;
                        }
                        if(mm<10){
                            mm='0'+mm;
                        }
                        var today = dd+'/'+mm+'/'+yyyy;
                        message.channel.setTopic("Archive on " + today).then(channel => message.channel.setName(`${new Date().getTime()}`).then(channel => message.channel.setParent(message.guild.channels.find("id", "422401457778720768"))));
                        var person = message.channel.name.slice(num) * 3;
                        console.log(person);
                        message.channel.overwritePermissions(message.guild.members.find('id', person), {
                          READ_MESSAGES: false
                        })
                        message.channel.send({embed: {
                            color: 0x2C8CFC,
                            title: ":open_file_folder: **ARCHIVED**",
                            url: "https://jenkinsdesigns.com",
                            fields: [{
                                name: "Arhived on",
                                value: today
                              }
                            ],
                            timestamp: new Date(),
                            footer: {
                              icon_url: bot.user.avatarURL,
                              text: "© JenkinsDesigns"
                            }
                          }
                      });
                        var botlogs = message.guild.channels.find("name", "log");
                        botlogs.send({embed: {
                            color: 0x2C8CFC,
                            title: ":file_folder: **ARCHIVED**",
                            url: "https://jenkinsdesigns.com",
                            description: "Something has been archived",
                            fields: [{
                                name: "Archiver",
                                value: "<@" + message.author.id + ">"
                              },
                              {
                                name: "Channel",
                                value: "<#" + message.channel.id + ">"
                              }
                            ],
                            timestamp: new Date(),
                            footer: {
                              icon_url: bot.user.avatarURL,
                              text: "© JenkinsDesigns"
                            }
                          }
                      });
                    }, 5000);
                    collector.stop();
                    }
                  });
              } else {
                message.reply("You can only do this in quote channels!")
              }
            } else {
              message.reply("You do not have permission to change this channel!");
            }
          } else {
            message.reply("This command can not be done in PM!");
          }
          break;
      case "quotetoorder":
        if (message.channel.type != 'dm') {
          if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id) || message.member.roles.has(message.guild.roles.find('name', 'Sales Representative').id)) {
            if (args.length > 1) {
              if (message.channel.name.toLowerCase().includes("quote-")) {
                message.reply("Are you sure that you would like to change this to an order? (Send the thumbs up emoji in this channel) This will expire in 30 seconds.").then(msg => {msg.delete(30000)}).catch();
                const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 30000 });
                collector.on('collect', message => {
                  if (message.content == "👍") {
                      message.channel.sendMessage(`${message.author}, Changing in 5 seconds..`);
                      setTimeout(function(){
                        var num = message.channel.name.slice(6);
                        message.channel.setTopic("Order #" + num).then(channel => message.channel.setName(`order-${args.join(" ").slice(13)}`).then(channel => message.channel.setParent(message.guild.channels.find("id", "417079925644722177"))));

                        message.channel.send({embed: {
                            color: 0x2C8CFC,
                            title: ":open_file_folder: **UPDATED ORDER**",
                            url: "https://jenkinsdesigns.com",
                            fields: [{
                                name: "Updated quote to order",
                                value: "Hello again!\n\nLooks like we have a deal, is that what they say these days? If there is anything you would like added to your quote, please state it now; if not, please wait patiently while one of our @C-Suite gets you to the freelancer that suits you. If you have any doubts, send us a message (we do not bite).\n\n Safe Travels!\n\n- JenkinsDesigns Bot"
                              }
                            ],
                            timestamp: new Date(),
                            footer: {
                              icon_url: bot.user.avatarURL,
                              text: "© JenkinsDesigns"
                            }
                          }
                      });
                        var botlogs = message.guild.channels.find("name", "log");
                        botlogs.send({embed: {
                            color: 0x2C8CFC,
                            title: ":file_folder: **CHANGED QUOTE**",
                            url: "https://jenkinsdesigns.com",
                            description: "A quote has been changed to an order",
                            fields: [{
                                name: "Changer",
                                value: "<@" + message.author.id + ">"
                              },
                              {
                                name: "Channel",
                                value: "<#" + message.channel.id + ">"
                              }
                            ],
                            timestamp: new Date(),
                            footer: {
                              icon_url: bot.user.avatarURL,
                              text: "© JenkinsDesigns"
                            }
                          }
                      });
                    }, 5000);
                    collector.stop();
                    }
                  });
              } else {
                message.reply("You can only do this in quote channels!")
              }
            } else {
              message.reply("You must do !quotetorder (Client)-(Project)")
            }
          } else {
            message.reply("You do not have permission to change this channel!");
          }
        } else {
          message.reply("This command can not be done in PM!");
        }
        break;
      case "paypalconversion":
          if (args[1] != null || isNaN(args[1])) {
            var number = Number.parseFloat(args[1]);
            var step1 = (2.9 / 100) * number;
            var step2 = (Number.parseFloat(step1) + Number.parseFloat(number));
            var step3 = (Number.parseFloat(step2) + 0.3);
            var finalpre = Number.parseFloat(step3).toFixed(2);
            var final = finalpre;
            console.log(`${number}, ${step1}, ${step2}, ${step3}, ${finalpre}`);
            message.channel.send({embed: {
                color: 0x2C8CFC,
                fields: [{
                    name: `$${number}`,
                    value: `You would pay: ${final}`
                  }
                ],
              }
          });
          } else {
            message.reply("You must do !paypalconvertion (Amount)");
          }
        break;
      case "managercut":
            if (args[1] != null || isNaN(args[1])) {
              var number = Number.parseFloat(args[1]);
              var decimal = Math.round(number * 0.125).toFixed(2);
              var finalpre = Number.parseFloat(decimal).toFixed(2);
              var final = finalpre;
              message.channel.send({embed: {
                  color: 0x2C8CFC,
                  fields: [{
                      name: `$${number}`,
                      value: `Management would get: ${final}`
                    }
                  ],
                }
            });
            } else {
              message.reply("You must do !managercut (Amount)");
            }
          break;
      case "close":
        if (message.channel.type != 'dm') {
          var authorid = Math.round(message.author.id / 3);
          if (message.member.roles.has(message.guild.roles.find('name', 'C-Suite').id) || message.member.roles.has(message.guild.roles.find('name', 'Sales Representative').id)) {
              message.reply("Are you sure that you would like to close this channel? (Send a thumbs up emoji in this channel!) This will expire in 30 seconds.").then(msg => {msg.delete(30000)}).catch();
              const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 30000 });
              collector.on('collect', message => {
                  if (message.content == "👍") {
                      message.channel.sendMessage(`${message.author}, Deleting in 5 seconds..`);
                      setTimeout(function(){
                        message.channel.delete();
                        var botlogs = message.guild.channels.find("name", "log");
                        botlogs.send({embed: {
                            color: 0x2C8CFC,
                            title: ":file_folder: **CLOSED CHANNEL**",
                            url: "https://jenkinsdesigns.com",
                            description: "A channel has been closed",
                            fields: [{
                                name: "Closer of the channel",
                                value: "<@" + message.author.id + ">"
                              },
                              {
                                name: "Channel",
                                value: "#" + message.channel.name + ""
                              }
                            ],
                            timestamp: new Date(),
                            footer: {
                              icon_url: bot.user.avatarURL,
                              text: "© JenkinsDesigns"
                            }
                          }
                      });
                      }, 5000);
                  }
              });
          } else {
            message.reply("You can not close this channel!");
          }
        } else {
          message.reply("This command can not be done in PM!");
        }
        break;
      case "quote":
        if (message.channel.type != 'dm') {
          var authorid = Math.round(message.author.id / 3);
          if (message.guild.channels.find("name", `quote-${authorid}`) == null) {
            message.guild.createChannel(`quote-${authorid}`, 'text', [
            {
              id: message.author.id,
              allow: ['READ_MESSAGES']
            },
            {
              id: message.guild.roles.find('name', 'Member'),
              deny: ['READ_MESSAGES']
            },
            {
              id: message.guild.roles.find('name', 'Sales Representative'),
              allow: ['READ_MESSAGES']
            },
            {
              id: message.guild.roles.find('name', 'C-Suite'),
              allow: ['READ_MESSAGES']
            },
            {
              id: bot.user.id,
              allow: ['READ_MESSAGES']
            }
            ]).then(channel => {
              channel.setParent(message.guild.channels.find("id", "417080019513245717"));
              channel.setTopic("New quote for " + message.author.id);
              channel.send({embed: {
                  color: 0x2C8CFC,
                  title: ":open_file_folder: **NEW QUOTE**",
                  url: "https://jenkinsdesigns.com",
                  fields: [{
                      name: "New Quote",
                      value: `Hello ${message.author},\n\nI am a bot from JenkinsDesigns. My job is to get you to the right place in the quickest time possible so you can continue with your daily activities such as beating someone in SkyWars, or becoming the President of the United States, you know what I mean.\n\nMay you post all information related to your quote here, this contains but not limited to: Your Budget, Project Name, Deadline and the Order Details. Additionally, if you require an NDA to be signed, you must let us know in advanced.\n\nHave fun typing!\n\n- JenkinsDesigns Bot`
                    },
                    {
                      name: "Creator of quote",
                      value: "<@" + message.author.id + ">"
                    }
                  ],
                  timestamp: new Date(),
                  footer: {
                    icon_url: bot.user.avatarURL,
                    text: "© JenkinsDesigns"
                  }
                }
              });
              const collector = new Discord.MessageCollector(channel, m => m.author.id != bot.user.id, { time: 900000 });
              channel.sendMessage("Before we get started with anything do you mind letting me know who refferred you to JenkinsDesigns or if no one reffered you, how you found JenkinsDesigns?");
              collector.on('collect', message => {
                if (message.content.length > 1) {
                  user = message.content;
                  collector.stop();
                  message.reply("Awesome thanks. If you are already working with a salesrep please run !setrep.");
                  var botlogs = message.guild.channels.find("name", "log");
                  botlogs.send({embed: {
                      color: 0x2C8CFC,
                      title: ":open_file_folder: **NEW QUOTE**",
                      url: "https://jenkinsdesigns.com",
                      description: "A new quote channel has been created",
                      fields: [{
                          name: "Creator of quote",
                          value: "<@" + message.author.id + ">"
                        },
                        {
                          name: "How they heard about JD",
                          value: user
                        },
                        {
                          name: "Channel",
                          value: "<#" + channel.id + ">"
                        }
                      ],
                      timestamp: new Date(),
                      footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© JenkinsDesigns"
                      }
                    }
                  });
                }
              });

              message.reply("Your quote has been created! <#" + channel.id + ">")
            });
          } else {
            var authorid = Math.round(message.author.id / 3);
            var channel = message.guild.channels.find("name", `quote-${authorid}`);
            message.channel.send(`You already have a quote channel open at <#${channel.id}>. To close this quote please do !close in the channel!`);
          }
        } else {
          message.reply("This command can not be done in PM!");
        }
        break;
      case "support":
          if (message.channel.type != 'dm') {
            var authorid = Math.round(message.author.id / 3);
            if (message.guild.channels.find("name", `support-${authorid}`) == null) {
              message.guild.createChannel(`support-${authorid}`, 'text', [
              {
                id: message.author.id,
                allow: ['READ_MESSAGES']
              },
              {
                id: message.guild.roles.find('name', 'Sales Representative'),
                allow: ['READ_MESSAGES']
              },
              {
                id: message.guild.roles.find('name', 'Member'),
                deny: ['READ_MESSAGES']
              },
              {
                id: message.guild.roles.find('name', 'C-Suite'),
                allow: ['READ_MESSAGES']
              },
              {
                id: bot.user.id,
                allow: ['READ_MESSAGES']
              }
              ]).then(channel => {
                channel.setParent(message.guild.channels.find("id", "417125082033291265"));
                channel.setTopic("New support ticket for " + message.author.id);
                channel.send({embed: {
                    color: 0x2C8CFC,
                    title: ":open_file_folder: **NEW SUPPORT TICKET**",
                    url: "https://jenkinsdesigns.com",
                    fields: [{
                        name: "New Support Ticket",
                        value: `G'day, ${message.author}.\n\nYou have reacher the support line. Please post your issue below and one of our secret MI5 soldiers will come out from the bushes and hunt down that solution.\n\nDon't let me down sergeant!\n\n- JenkinsDesigns Bot`
                      },
                      {
                        name: "Creator of ticket",
                        value: "<@" + message.author.id + ">"
                      }
                    ],
                    timestamp: new Date(),
                    footer: {
                      icon_url: bot.user.avatarURL,
                      text: "© JenkinsDesigns"
                    }
                  }
                });
                var botlogs = message.guild.channels.find("name", "log");
                botlogs.send({embed: {
                    color: 0x2C8CFC,
                    title: ":open_file_folder: **NEW SUPPORT TICKET**",
                    url: "https://jenkinsdesigns.com",
                    description: "A new support ticket channel has been created",
                    fields: [{
                        name: "Creator of ticket",
                        value: "<@" + message.author.id + ">"
                      },
                      {
                        name: "Channel",
                        value: "<#" + channel.id + ">"
                      }
                    ],
                    timestamp: new Date(),
                    footer: {
                      icon_url: bot.user.avatarURL,
                      text: "© JenkinsDesigns"
                    }
                  }
                });
                message.reply("Your support ticket has been created! <#" + channel.id + ">")
              });
            } else {
              var authorid = Math.round(message.author.id / 3);
              var channel = message.guild.channels.find("name", `support-${authorid}`);
              message.channel.send(`You already have a support ticket channel open at <#${channel.id}>. To close this support ticket please do !close in the channel!`);
            }
          } else {
            message.reply("This command can not be done in PM!");
          }
          break;
      case "newcommission":
          let CSuite = bot.guilds.get("358522273725939714").roles.find("name", "C-Suite");
          if (message.member.roles.has(CSuite.id) || message.member.roles.has(message.guild.roles.find('name', 'Sales Representative').id)) {
            if (args.length < 2) {
              message.delete();
              message.reply("Please do !newcommission @Rank (Description)")
              .then(msg => {
                msg.delete(5000)
              })
              .catch();
            } else {
              if (message.mentions.roles.size > 0) {
                message.delete();
                let desc = args.join(" ").slice(args[1].length + args[0].length + 2);
                let group = message.mentions.roles.first();
                let comEmbed = new Discord.RichEmbed()
                .setTitle("New Commission")
                .setDescription("Added by <@" + message.member.id + ">")
                .setColor("#2C8CFC")
                .addField("Type", group)
                .addField("Details", desc)
                .setFooter("If you are able to do this commission please contact the person who added this commission.");

                let comEmbed2 = new Discord.RichEmbed()
                .setTitle("New Commission")
                .setDescription("Added by <@" + message.member.id + ">")
                .setColor("#2C8CFC")
                .addField("Details", desc)
                .setFooter("If you are able to do this commission please contact the person who added this commission.");

                let logs = message.guild.channels.find(`name`, "commissions");
                if(!logs) return message.channel.send("Can't find commissions channel.");
                logs.send(`${group}`)
                logs.send(comEmbed);

                message.guild.fetchMembers().then(data => {
                  message.mentions.roles.first().members.forEach(function(guildMember) {
                    guildMember.sendMessage("Hey! There is a new commission, and we think you may be able to do it!");
                    guildMember.send(comEmbed2);
                  });
                }).catch(err => {});


                message.reply("Added the commission.")
                .then(msg => {
                  msg.delete(5000)
                })
                .catch();
              } else {
                message.delete();
                message.reply("Please do !newcommission @Rank (Description)")
                .then(msg => {
                  msg.delete(5000)
                })
                .catch();
              }
            }
          } else {
            message.delete();
            message.reply('You do not have access to this command.')
            .then(msg => {
              msg.delete(5000)
            })
            .catch();
          }
        break;
    case "staffhelp":
      const embed3 = new Discord.RichEmbed()
      .setColor(0x2C8CFC)
      .setThumbnail("https://jenkinsdesigns.com/img/JD-White.png")
      .addField("Help Menu", `Hello ${message.author}! I see you are looking for staff help? If this menu doesn't help you please don't hesitate to contact a member of C-Suite.`)
      .addField("Commands", `--`)
      .addField("!quotetoorder (client-project)", `This will convert the quote channel to an order channel and will rename the channel with that naming convention.`)
      .addField("!close", `This will close quotes, orders, and support tickets`)
      .addField("!getinfo (User)", `This will ask the user some questions that we need and will log their answers. **Make sure they are activly there before running this as they must respond to questions within 2 minutes**`)
      .addField("!newstaff (User)", `This will ask new staff members some questions that we need to get them sorted as staff.`)
      .addField("!managercut (Amount)", `This will return the amount that our managament team will get off of the price specified.`)
      .addField("!website", `This send you a link to our website.`)
      .addField("!newcommission (Role) (Description)", `This add a commission to the commissions channel, please make sure you have all the details before doing this.`)
      message.channel.send({embed: embed3});
      const embed2 = new Discord.RichEmbed()
      .setColor(0x2C8CFC)
      .setTimestamp()
      .addField("!rep", `This will remove all other sales reps from a support ticket, quote, or order.`)
      .addField("!addreps", `This will add all other sales reps from a support ticket, quote, or order.`)
      .addField("!add @(Username#Desc)", `This will add a user to a support ticket, quote, or order.`)
      .addField("!remove (User)", `This will remove a user to a support ticket, quote, or order.`)
      .addField("!setstatus (Status)", `This set the status of a support ticket, quote, or order.`)
      .addField("!status", `This get the status of a support ticket, quote, or order.`)
      .addField("!accepting", `This set you as accepting which means you are available for commissions.`)
      .addField("!notaccepting", `This set you as not accepting which means you are not available for commissions.`)
      .addField("!checkaccepting (User)", `This will check if the specified user is available for commissions or not.`)
      .addField("!announcement", `This will then ask you to submit a message and it will send it in the #announcements channel.`)
      .addField("!announcementtag", `This will then ask you to submit a message and it will send it in the #announcements channel with a tag.`)
      .addField("!invites", `This show you how many people you have invited to our discord server. You must create a custom invite link at the top left where it says "JenkinsDesigns"`)
      message.channel.send({embed: embed2});
      break;
    default:

    }

});


bot.login(TOKEN);
