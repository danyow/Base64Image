# import base64
# f=open('723.png','rb')
# ls_f=base64.b64encode(f.read())
# f.close()
# print(ls_f)

# import pyperclip

# # data = pyperclip.paste()
# data = pyperclip.PyQt4()

# print(data)

import time
import base64
from AppKit import NSPasteboard, NSPasteboardTypePNG, NSPasteboardTypeTIFF


def get_paste_img_file():
    # print("准备执行")
    pb = NSPasteboard.generalPasteboard()
    data_type = pb.types()
    # 如果是 image file

    # print(data_type)

    now = int(time.time() * 1000)

    if NSPasteboardTypePNG in data_type:
        # print("是图片")
        data = pb.dataForType_(NSPasteboardTypePNG)
        encode = base64.b64encode(data)
        # print(str(encode))
        print(bytes.decode(encode))
    elif NSPasteboardTypeTIFF in data_type:
        print("no image")
    else:
        print("no image")


get_paste_img_file()
