# Client.py

# Import socket module
import socket            
# Create a socket object
s = socket.socket()        
# Define the port on which you want to connect
port = 12345               
# connect to the server on local computer
s.connect(('127.0.0.1', port))
# receive data from the server and decoding to get the string.
print (s.recv(1024).decode())
# close the connection
s.close()  

# Server.py

# first of all import the socket library
import socket            
# next create a socket object
s = socket.socket()        
print ("Socket successfully created")
# reserve a port on your computer in our
# case it is 12345 but it can be anything
port = 12345               
# Next bind to the port
# we have not typed any ip in the ip field
# instead we have inputted an empty string
# this makes the server listen to requests
# coming from other computers on the network
s.bind(('', port))        
print ("socket binded to %s" %(port))
# put the socket into listening mode
s.listen(5)    
print ("socket is listening")           
# a forever loop until we interrupt it or
# an error occurs
while True:
    # Establish connection with client.
    c, addr = s.accept()    
    print ('Got connection from', addr )
    # send a thank you message to the client. encoding to send byte type.
    c.send('Thank you for connecting'.encode())
    # Close the connection with the client
    c.close()
    # Breaking once connection closed
    break

################################################################################
## UDP file transfer

# sender.py
import socket
import time
import sys
UDP_IP = "127.0.0.1"
UDP_PORT = 5005
buf = 1024
file_name = sys.argv[1]
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.sendto(file_name, (UDP_IP, UDP_PORT))
print("Sending %s ..." % file_name)
f = open(file_name, "r")
data = f.read(buf)
while(data):
    if(sock.sendto(data, (UDP_IP, UDP_PORT))):
        data = f.read(buf)
        time.sleep(0.02) # Give receiver a bit time to save
sock.close()
f.close()

#receiver.py
import socket
import select
UDP_IP = "127.0.0.1"
IN_PORT = 5005
timeout = 3
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((UDP_IP, IN_PORT))
while True:
    data, addr = sock.recvfrom(1024)
    if data:
        print("File name:", data)
        file_name = data.strip()
    f = open(file_name, 'wb')
    while True:
        ready = select.select([sock], [], [], timeout)
        if ready[0]:
            data, addr = sock.recvfrom(1024)
            f.write(data)
        else:
            print("%s Finish!" % file_name)
            f.close()
            break

# https://pastebin.com/4yye1QpR