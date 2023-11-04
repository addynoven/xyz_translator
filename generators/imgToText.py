import easyocr
from sys import argv
import sys
sys.stdout.reconfigure(encoding='utf-8')
if ((len(argv) == 3)):
    reader = easyocr.Reader([argv[2]], verbose=False)
    result = reader.readtext(argv[1])
    for detection in result:
        print(detection[1])
elif ((len(argv) == 2)):
    reader = easyocr.Reader(verbose=False)
    result = reader.readtext(argv[1])
    for detection in result:
        print(detection[1])
else:
    print("need more argument to work")
