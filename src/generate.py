import os
from jsmin import jsmin

js = ""
js_external = ""
size = 0
size_external = 0

def displaysize(bytes):
	prefixes = ["","K","M","G","T"]
	ord = 0
	while bytes >= 1000:
		bytes = bytes / 1000
		ord += 1

	return str(round(bytes,1)) + prefixes[ord] + "B"



for folder in os.listdir("js"):

	if folder == "lib":
		js += "var neo = function(){"
		export = []

	for file in os.listdir("js/" + folder):
		pth = "js/" + folder + "/" + file

		if folder == "thirdparty":
			size_external += os.path.getsize(pth)
		else:
			size += os.path.getsize(pth)

		with open(pth) as js_file:
			lines = js_file.readlines()
			for l in lines:
				if l.startswith("export "):
					export += l[7:].replace(" ","").split(",")
				else:
					if folder == "thirdparty":
						js_external += l
					else:
						js += l

	if folder == "lib":
		js += "return {" + ",".join(e + ":" + e for e in export) + "}"
		js += "}();"


with open("../dist/neopolitan.js","w") as js_file:
	js_file.write(jsmin(js,quote_chars="'\"`"))
newsize = os.path.getsize("../dist/neopolitan.js")
oldsize = size
print("Generated base library, file size reduced by",int((1-(newsize/oldsize))*100),"% (" + displaysize(oldsize),"to",displaysize(newsize) + ")")

with open("../dist/neopolitan.full.js","w") as js_file:
	js_file.write(jsmin(js + "\n" + js_external,quote_chars="'\"`"))
newsize = os.path.getsize("../dist/neopolitan.full.js")
oldsize = size + size_external
print("Generated extended library, file size reduced by",int((1-(newsize/oldsize))*100),"% (" + displaysize(oldsize),"to",displaysize(newsize) + ")")
