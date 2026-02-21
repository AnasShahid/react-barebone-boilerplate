---
trigger: always_on
---

- when a new feature is requested, always create the feature inside the features directory and follow the rule-set/directory structure from the project-structure rules file. 
- declare proper export / re-exports in the features directory. 
- always use react-hook-form for creating the forms and use zod for schema validation
- write modular code which can be used easily in other places as well
- pages inside feature are merely presentational, when a new component (create form, update form, delete feature) is requested, make sure to create individual components for these requests and use from there
- components should be self-sufficient and must always be self-encapsulated. Use props as less as possible. 
- interactions with APIs and redux store, for individual components, should also be handled inside the specific components which need them. 
- always use proper loading states for when making API calls for when fetching/updating data. 
- always use skeleton for rendering loading states for different features, based on the actual feature's UI skeleton
- use sonner for triggering UI based notifications
- whenever you have to write plain text strings (static), use locales inside the features to add the unique keys for the strings. Group the keys added by component in the JSON structure so that it is easy to maintain and scale. 
- if you have to create custom (common) UI components, make sure those components are also based on the shadcn/ui components. 
- write error free, properly linted code.