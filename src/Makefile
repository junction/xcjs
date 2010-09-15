SRC =	core.js base.js util.js xc_dom_helper.js error.js xml.js registrar.js	\
	mixins/jid.js mixins/roster.js mixins/chat.js mixins/presence.js mixins/disco.js \
	mixins/discoverable.js mixins/handler_registration.js mixins/chat_state_notification.js	\
  services/roster.js services/chat.js services/presence.js services/disco.js	\
	entity.js stanza.js message.js \
	connection_adapter.js connection.js

DOCDIR = ../doc

JSDOCDIR = ../frameworks/jsdoc-toolkit
TEMPLATE = $(JSDOCDIR)/templates/xc

JAVA =	java

all:	src doc

src:	xc.js jslint

jslint:
	../frameworks/jslint/jslint ../xc.js

doc:	$(DOCDIR)/private/index.html $(DOCDIR)/public/index.html

xc.js:	Makefile $(SRC)
	cat $(SRC) > ../$@

$(DOCDIR)/private/index.html: Makefile $(SRC)
	$(JAVA) -jar $(JSDOCDIR)/jsrun.jar $(JSDOCDIR)/app/run.js --allfunctions --private -t=$(TEMPLATE) -d=$(DOCDIR)/private $(SRC)

$(DOCDIR)/public/index.html: Makefile $(SRC)
	$(JAVA) -jar $(JSDOCDIR)/jsrun.jar $(JSDOCDIR)/app/run.js -t=$(TEMPLATE) -d=$(DOCDIR)/public $(SRC)

clean-doc:
	rm -rf $(DOCDIR)

clean:
	rm -f xc.js
	rm -f *~
