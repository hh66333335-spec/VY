# Security Specification for Lumina

## 1. Data Invariants
- **User Profiles**: Only the authenticated user can create or update their own profile. Emails must be unique (via document ID being the UID).
- **Calls**: Anyone authenticated can create a call. Only the host can update the call status to 'ended'. Participants can only be added/removed if the call is 'active'.
- **Video Assets**: Only the owner can upload, update, or delete their video metadata.
- **IDs**: All document IDs must be alphanumeric and under 128 characters.

## 2. The "Dirty Dozen" Payloads (Denial Tests)
1. **Identity Spoofing (Users)**: User A tries to update User B's display name.
2. **Identity Spoofing (Videos)**: User A tries to change the `ownerId` of User B's video.
3. **Ghost Field Injection**: Adding `isVerified: true` to a VideoAsset during creation.
4. **Invalid State Transition**: A non-host user trying to end a call.
5. **Path Poisoning**: Creating a user document with a 2KB string as ID.
6. **Resource Exhaustion**: Uploading a 5MB string into the `title` field of a video.
7. **Orphaned Record**: Creating a video asset for a non-existent user.
8. **PII Leak**: A signed-in user trying to list all users' private emails.
9. **Timestamp Spoofing**: User providing a `createdAt` value in the past.
10. **Terminal State Bypass**: Updating a video asset's title after status is 'ready' (hypothetical locking).
11. **Type Poisoning**: Sending `duration: "long"` instead of a number.
12. **Blanket Read Attack**: Querying the `/videos` collection without an `ownerId` filter.

## 3. Test Runner Plan
- Implement `firestore.rules.test.ts` using `@firebase/rules-unit-testing`.
