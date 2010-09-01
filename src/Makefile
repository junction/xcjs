SRC =	core.js object.js error.js xml.js	\
	connection_adapter.js connection.js	\
	entity.js message.js	\
	roster.js presence.js chat.js disco.js

DOCDIR = ../doc

JSDOCDIR = ../frameworks/jsdoc-toolkit
TEMPLATE = $(JSDOCDIR)/templates/xc

JAVA =	java

all:	src doc

src:	xc.js

doc:	$(DOCDIR)/index.html

xc.js:	Makefile $(SRC)
	cat $(SRC) > ../$@

$(DOCDIR)/index.html: Makefile $(SRC)
	$(JAVA) -jar $(JSDOCDIR)/jsrun.jar $(JSDOCDIR)/app/run.js -a -p -t=$(TEMPLATE) -d=$(DOCDIR) $(SRC)

clean-doc:
	rm -rf $(DOCDIR)

clean:
	rm -f xc.js
	rm -f *~
