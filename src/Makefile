SRC =	license.js core.js base.js util.js error.js	\
	xc_dom_helper.js xml.js registrar.js packet_adapter.js	\
	mixins/discoverable.js mixins/handler_registration.js mixins/rosterx.js	\
	mixins/jid.js mixins/roster.js mixins/chat.js	\
	mixins/presence.js mixins/disco.js mixins/chat_state_notification.js	\
	services/roster.js services/chat.js services/presence.js services/disco.js	\
	mixins/v_card.js services/v_card.js services/private_storage.js	\
	entity.js stanza.js mixins/delayed_delivery.js message_stanza.js presence_stanza.js \
	connection_adapter.js connection.js strophe_adapter.js

DOCDIR = ../doc

JSDOCDIR = ../frameworks/jsdoc-toolkit
TEMPLATE = $(JSDOCDIR)/templates/xc

JAVA =	java

all:	src doc

src:	xc.js jslint xc.min.js

jslint:
	../frameworks/jslint/jslint ../xc.js

xc.js:	Makefile $(SRC)
	cat $(SRC) > ../$@

xc.min.js: xc.js
ifdef YUI_COMPRESSOR
	java -jar $(YUI_COMPRESSOR) ../$@.js -o ../$@.min.js
else
	@@echo "  YUI Compressor required to build minified version."
	@@echo "  Please set YUI_COMPRESSOR to the path to the jar file."
endif

doc:	$(DOCDIR)/private/index.html $(DOCDIR)/public/index.html

$(DOCDIR)/private/index.html: Makefile $(SRC)
	$(JAVA) -jar $(JSDOCDIR)/jsrun.jar $(JSDOCDIR)/app/run.js --allfunctions --private -a -t=$(TEMPLATE) -d=$(DOCDIR)/private $(SRC)

$(DOCDIR)/public/index.html: Makefile $(SRC)
	$(JAVA) -jar $(JSDOCDIR)/jsrun.jar $(JSDOCDIR)/app/run.js -t=$(TEMPLATE) -d=$(DOCDIR)/public $(SRC)

clean-doc:
	rm -rf $(DOCDIR)

clean:
	rm -f ../xc.js
	rm -f ../xc.min.js
	rm -f *~
	rm -f mixins/*~
	rm -f services/*~
