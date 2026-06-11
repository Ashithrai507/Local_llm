The porpuse of this project is to build a locally running LLM model. But unlike traditional way here we are using two computational devices.
1. **The Host**: Runs the LLM engine, loads the model into its VRAM/RAM, and exposes an API endpoint (usually HTTP).
2. **The Client**: Runs a user interface (UI) or a coding extension that connects to the host's IP address.

But here instead of using pre built tools like Ollama or LMstudio we are going build somthing from root using llama-cpp

But the first thing to do is build a NAS from scratch
I decided to build a complate NAS system that can 
- File Storage
- File Sharing
- Media Streaming
- LLM Hosting
- Website Hosting
- Docker Management

----------------
Mile 1:
The Ashith NAS project is a self-hosted Network Attached Storage (NAS) platform being developed from scratch on an Omarchy Linux server with the long-term vision of evolving into a complete self-hosted infrastructure solution for file management, media streaming, AI model hosting, website deployment, and cloud services. The current implementation consists of a FastAPI-based backend and a React-based frontend connected through REST APIs, enabling seamless file upload, listing, download, and deletion operations through a web interface accessible over a local network. The backend manages file storage using the native Linux file system, while the frontend provides a user-friendly interface for interacting with stored content without requiring direct API access. This milestone establishes the core architecture of the platform, successfully demonstrating end-to-end communication between the client interface, application server, and storage layer, thereby creating a functional NAS prototype and laying the foundation for future enhancements such as folder management, user authentication, access control, file sharing, media services, container orchestration, and remote access capabilities.

---------------
Mile 2:
This is about build a real NAS software. How actuall NAS works. How the actuall NAS folder structrue will like. The next step will be building that. 

- 1:Folder Management
```sscs
storage/
├── Documents/
│   ├── Resume.pdf
│
├── Photos/
│   ├── vacation.jpg
│
└── College/
    ├── assignment.pdf
```
backend:
```sscs
POST /folder
GET  /folders
GET  /folder/{name}
DELETE /folder/{name}
```

- 2:Navigation
- 3:File Metadata
- 4:Search
- 5:File Sharing
