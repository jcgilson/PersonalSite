import pandas as pd
import json

# Import Sheet Contents
configurationContents = pd.read_excel(r'SiteConfiguration.xlsx', sheet_name="Site Configuration")
itinerariesContents = pd.read_excel(r'SiteConfiguration.xlsx', sheet_name="Itineraries")
nationalParksContents = pd.read_excel(r'SiteConfiguration.xlsx', sheet_name="National Parks")
print (configurationContents)

# Create Itineraries File
newItinerariesFile = open("configurationSample2.json", "w")
##writeToNewFile = fileContents.to_json(orient="split")


itinerariesJsonContents = itinerariesContents.to_json(orient="split")
itinerariesParsedJson = json.loads(itinerariesJsonContents)

# Data Headers
writeToNewItinerariesFile = json.dumps(itinerariesParsedJson["data"], indent=4)
print(writeToNewItinerariesFile)

newItinerariesFile.write(writeToNewItinerariesFile)


##newItinerariesFile.write(str(fileContents))


newItinerariesFile.write("""{
    "app" : {
        "background": {
            "type" : "image",
            "image": "delicateArch",
            "color": "FF0000"
        }
    },
    "itineraries": {
        "cardVariation": "card",
        "itineraries": ""
""")

##for itinerary in 

##newItinerariesFile.write(itineraries)

newItinerariesFile.write("""
    }
}""")


newItinerariesFile.close()



# Generate CSS Styles from Site Configuration
cssFile = open("configurableStyles.css", "w")
cssFile.write("""/* App Configuration Styles */
/* Background colors */
.colorFFB3B3 {
    width: 100vw !important;
    height: 100vh !important;
    background-color: #FFB3B3;
    position: absolute;
    top: 0;
    z-index: -1;
}
""")
cssFile.close()






##import json

##x =  '{ "name":"John", "age":30, "city":"New York"}'
##y = json.loads(x)

##print(y["age"])
