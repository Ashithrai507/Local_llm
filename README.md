[vaultnas.site](https://vaultnas.site/)

I was just worried about my coding agents credit then i remember why not to run a LLM model completly locally. But running in one single device is not recommended, so why not build a dedicated server, so anyways building a server that runs a llm then why not build a complete server that will act as NAS or media streemer or LLM server whatever...
So first lets build a NAS from scatch. somthing like openmediavault where you can store upload and delete your data

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


<img width="1470" height="834" alt="Screenshot 2026-07-24 at 12 48 10 AM" src="https://github.com/user-attachments/assets/613082e9-3ebc-44c8-bea5-d047f3ed631e" />

<img width="1467" height="832" alt="Screenshot 2026-07-24 at 12 48 28 AM" src="https://github.com/user-attachments/assets/78276d68-d4ef-440b-ac03-cbd417e317c7" />

<img width="1470" height="834" alt="Screenshot 2026-07-24 at 12 49 03 AM" src="https://github.com/user-attachments/assets/75958378-1d1d-43a4-96be-6e8eb4a442e2" />

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

Cloud Storage (upload, download, folder management)
Movie Streaming with metadata and video playback
JWT Authentication
Global access using Cloudflare Tunnel
FastAPI API documentation via Swagger
React + Vite frontend
FastAPI backend
```

- 2:Navigation
- 3:File Metadata
- 4:Search
- 5:Auth
- 6:File Sharing
