![](./assets/wireframe.png)
![](./assets/supabaseTable.png)
![](./assets/policies.png)
![](./assets/bucket.png)

# Plan

## Table

    - Profiles
        - id
        - user_id (foreign key to users table)
        - username (could use email)
        - bio
        - stars
        - avatar_url

## Pages

    - profile editor/creator
    - profile list (home)
    - profile detail

## HTML

    - editor page
        - FORM
            - input with label for USERNAME
            - input with label for BIO
            - input with label for Avatar
            - img (for preview of the avatar)
            - button
            - p tag in error display
        - profile list
            - list container that is hardcoded
        - profile detail
            - hardcode an img & header
            - stars detail container

### Events

    - editor page
        - page load -> getting profile information from supabase and display on form (if exists)
        - avatar image input ("change") -> display img preview
        - form submit
            - utilize the users input and send it to supabase
            - upsert to send supabase
            - error handling to display issues to user
        - profiles page
            - up and down vote button clicks
                - increment or decrement the stars count in supabase
            - page load fetch
        - profiles list
            - page load fetch

### Functions

    - uploadImage(imagePath, imageFile)
    - upsertProfile(profile)
    - getProfile(user_id) & getProfileById(id)
    - incrementStars(id) and decrementStars(id)

### Slices

    - create/edit simple profile (username & bio)
    - add in avatar upload to profile
    - get Profile back from supabase (use it to fill in the form)
    - error handling & button disable
    - profiles list
    - profile detail page & stars up and down votes

    ### PART B (MESSAGING)

    Profile Page

    -HTML

    form with label and button (for message input)

    -EVENTS

    on load
    -subscribe for realtime on messageCreate

    on formSubmit
    -get values from form input
    -check sender has profile
    -send message to supabase
    -form reset
    -fetchAndDisplay()
    THEN REALTIME BABY!

    -Funcs
    -createMessage
    -onMessage (this is realtime)
