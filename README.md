# Project-1
This is our First group Project ! Our group partners are Julian Aguilar (Me) , Ibrahima Diallo , Aliviah Hilliard and Keiquan (Key) Blackmon

Project Description: The goal of this project was to create a web app, that met the following criteria:

    * Use a CSS framework other than Bootstrap(Bootstrap will be used as well).
    * Be deployed to GitHub Pages.
    * Be interactive (i.e., accept and respond to user input).
    * Use at least two server side apis.
    * Does not use alerts, confirms, or prompts (use modals).
    * Use client-side storage to store persistent data.
    * Be responsive.
    * Have a polished UI.
    * Have a clean repository that meets quality coding standards (file structure, naming conventions, follows best practices for class/id naming conventions, indentation, quality comments, etc.).
    * Have a quality README (with unique name, description, technologies used, screenshot, and link to deployed application).

Use Case: This type of web application will utiilize 2 different server side API's (Walk Score & TomTom), along with 2 different CSS Frameworks (BootStrap and Pure). The goal of this web application is to provide users with a visual map of an input location as well as generate a WalkScore for that location as well. The WalkScore is based off of the walkability, public transit options and bike pathways presented in a given area. 

    * When a user opens the website, they are greeted with an input field to add an address, zip code, city or state
    * When the user inputs an address, zip code, city or state, they are presented a map of input location, with pre-determined places of interest
    * At the same time, the user is also presented with a generated WalkScore based on that location.
    * The user is given the opportunity to adjust the parameters for POI within their given location. (This includes the ability to select/un-select certain POI types, as well as adjust the radius from the given location).
    * After the POI map and WalKScore are generated for a given location, that information is saved in local storage. 
    * The user is presented with a button underneath the generated information, allowing them to "input a new location". This will essentially take them back to the homne page, whether they are able to input a new location, starting a new request.