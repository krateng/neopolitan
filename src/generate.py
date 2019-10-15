import os
from jsmin import jsmin

minified = ""
size = 0

def displaysize(bytes):
	prefixes = ["","K","M","G","T"]
	ord = 0
	while bytes >= 1000:
		bytes = bytes / 1000
		ord += 1

	return str(round(bytes,1)) + prefixes[ord] + "B"

for folder in os.listdir("js"):
	for file in os.listdir("js/" + folder):
		pth = "js/" + folder + "/" + file
		size += os.path.getsize(pth)
		with open(pth) as js_file:
		    minified += jsmin(js_file.read(), quote_chars="'\"`")

with open("../dist/neopolitan.js","w") as js_file:
	js_file.write(minified)

newsize = os.path.getsize("../dist/neopolitan.js")
print("Reduced file size from",displaysize(size),"to",displaysize(newsize))
print("Reduction by",int((1-(newsize/size))*100),"%")
