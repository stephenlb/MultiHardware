#Example to stream temperature and humidity values to a browser in realtime

import os
import time
import sys
from pubnub import Pubnub
import Adafruit_DHT as dht


pubnub = Pubnub(publish_key='pub-c-6dbe7bfd-6408-430a-add4-85cdfe856b47', subscribe_key='sub-c-2a73818c-d2d3-11e3-9244-02ee2ddab7fe')
 #use your own keys
 #need to add auth-key

def callback(message):
    print(message)

#published in this fashion to comply with Eon
while True:
    h,t = dht.read_retry(dht.DHT22, 4)
    pubnub.publish('tempeon', {
        'columns': [
            ['temp-pi', t],
            ['username', MotorTemp]
            ]
        })
    pubnub.publish('humeon', {
        'columns': [
            ['humidity', h],
            ['username', Humidity]
            ]

        })
