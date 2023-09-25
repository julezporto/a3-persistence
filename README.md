## Plant Watering Tracker

Juliana Porto
[https://a3-juliana-porto.glitch.me/](https://a3-juliana-porto.glitch.me/)

Meet the <b>Plant Watering Tracker</b>!

First, login to your Plant Watering Tracker account or create a new account. Information for a pre-set account can be found below. 
- _Username_: plantmom 
- _Password_: iloveplants

Next, input your plant's name, type, and the last day you watered it. When you click submit, a new plant will be added and all of your previously added plants will be loaded in. All of your plants can be viewed in the plant archive table. Add as many plants as you have!

The Plant Watering Tracker will then calculate the next date your plant will need to be watered and save that data in the plant archive table as well. The Plant Watering Tracker does its next watering (derived field) calculation by taking into account the plant's type and the last date you watered it. The next watering date logic:

1. "Succulent or Cactus" or "Air Plant": water every 2 weeks
2. "Tropical" or "Aquatic": water every 3 days
3. Everything else: water every week

You also have the ability to delete dead plants and edit plant entries to update the plant name, type, and/or last watering date.

To accomplish this:

- A `Server` was created using Express.
- A `Results` functionality was created using a table to show all data associated with a logged in user (except passwords).
- A `Form/Entry` functionality was created which allowed users to add, delete, and edit data items associated with each user account.
- There is persistent data storage between server sessions using the mongodb node.js library.
- The [sakura](https://oxal.org/projects/sakura/) CSS class-less framework was used for the bulk of styling. Additional CSS overriding was used to achieve Design Achievement 1 (see below).
- User logins are verified using a table in the mongodb database that stores all usernames and passwords.

### Design/Evaluation Achievements

- **Design Achievement 1**: Made site accessible using the resources and hints available from the W3C by implementing and/or following twelve tips from their tips for writing, tips for designing, and tips for development explained below:

  1. _Associate a label with every form control_: I included a label for every form field including those for the edit functionality.
  2. _Include alternative text for images_: I made sure to include alternative text for all images using the standards from the [W3 Images Tutorial](https://www.w3.org/WAI/tutorials/images/).
  3. _Provide informative, unique page titles_: I made sure to have all page titles be descriptive of their purpose.
  4. _Use headings to convey meaning and structure_: For all major sections of application, appropriate headings exist that are short, but clearly describe their related sections.
  5. _Make link text meaningful_: I made sure to use link text to describe the target page that the link will direct the user to instead of simply connecting a link to text such as "click here". This also applies for button text as well.
  6. _Provide clear instructions_: I included useful instructions for all form fields through the use of labels, placeholders, and simple paragraph descriptions.
  7. _Keep content clear and concise_: I wrote in short, clean sentences and paragraphs for easy user understanding. I strayed from using complex words and made sure to use structured formatting as appropriate.
  8. _Don’t use color alone to convey information_: Anytime a color was used to show importance, I also included a symbol to convey the message. Example: required form fields are displayed with a red \* and this is explained at the top of the form.
  9. _Use headings and spacing to group related content_: All major sections have appropriate headings and related content is spaced out to limit user confusion.
  10. _Ensure that all interactive elements are keyboard accessible_: I added tabindex to any fields that could not already be tabbed to, for example the dropdown field.
  11. _Provide meaning for non-standard interactive elements_: I have applied ARIA elements for various elements in my html such as aria-hidden="true" for my hidden edit form.
  12. _Reflect the reading order in the code order_: Everything displayed on page is also in that order throughout the code, images included.

- **Design Achievement 2**: CRAP principles from the Non-Designer's Design Book readings
  1. _Contrast_: For the login page of my application, the object with the most contrast is the header 1 tag, which in this case says "Log in." This is true of all the pages as the header 1 tag, and all other tags, maintain consistent styling throughout the entire application (AKA repetition). These objects have great contrast because of how large and bold they are in comparison to all other objects on the page. The second object with the most contrast would be the button elements. This is because of their color difference against the stark white background, making them highly noticeable and encouraging user interaction. The contrast between the vibrant button colors and the clean white backdrop not only catches the user's eye but also serves as a visual cue, guiding them toward important actions and creating a visually appealing design that enhances the overall user experience.
  2. _Proximity_: I used proximity as a fundamental design principle to group objects of similar functionality effectively. For instance, on the main user page, all elements related to adding a new plant are deliberately placed closely together. This not only creates a logical grouping but also guides the user's focus to the specific task at hand. Similarly, in the plant archive section of the same page, I employed proximity to cluster relevant elements, ensuring that users can easily locate and interact with their stored plant data. Additionally, proximity was utilized to create clear distinctions between sections with different purposes. For instance, there is noticeable spacing above and below the "add a new plant" section on the main page, setting it apart from the archive section. This deliberate spacing serves as a visual cue, signaling to the user that these sections have distinct functions and encouraging a seamless and intuitive user experience. By effectively using proximity in this manner, I aimed to enhance user navigation and comprehension, contributing to the overall usability and clarity of the application.
  3. _Repetition_: As previously mentioned, repetition plays a significant role in the design and functionality of my website. This repetition is not solely a result of the Sakura CSS framework's implementation but also a deliberate choice within my HTML structure. I intentionally repeated various layouts and elements consistently throughout the application, including form fields, buttons, and headers. By doing so, my aim was to create a cohesive and user-friendly experience. Users benefit from a sense of familiarity as they navigate the site, making it easier for them to maintain a state of flow and simplicity throughout their entire interaction with the application. This design strategy ensures that users can quickly understand and interact with different parts of the site without encountering unexpected changes in design or layout. In essence, repetition is a cornerstone of the user-centric design, enhancing usability and ensuring a seamless user experience across the entire application.
  4. _Alignment_: Throughout the entire application, I prioritized alignment as a guiding principle to direct the user's focus effectively. I ensured that all crucial elements were consistently left-aligned, providing users with a clear and predictable reading pattern. However, one notable exception to this left alignment was the placeholders within each form field. These placeholders were intentionally slightly indented to the right, facilitating quick identification of which label corresponds to each form field. This approach also extended to text inside buttons, but I took care to ensure that the indents of both elements aligned precisely. This meticulous alignment strategy not only improved user navigation but also maintained a visually harmonious and cohesive user interface, preventing any potential confusion and ensuring a smooth and intuitive user experience. By paying attention to these alignment details, I aimed to enhance usability and provide users with a well-structured and aesthetically pleasing interface.
