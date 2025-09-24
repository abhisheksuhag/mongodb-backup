# MongoDB Backup Automation

## Description

This project provides an automated solution to back up MongoDB databases
using the official `mongodump` tool, compress the backups into tarball
archives, and upload them securely to a Nextcloud instance. The entire
workflow is orchestrated using [Bun.js](https://bun.sh/), a fast
JavaScript runtime, enabling scripting, shell command execution, and API
integration in one seamless environment.

The backup process: - Dumps all MongoDB databases using the connection
URI. - Compresses the dump folder into a `.tar.gz` archive named by
week-month-year. - Uploads the archive to a specified Nextcloud folder
via WebDAV. - Cleans up temporary files after successful upload.

This workflow is intended to be run on a schedule (e.g., via cron) for
regular, offsite, and reliable MongoDB backups with long-term retention.

------------------------------------------------------------------------

## Features

-   Full backup of all MongoDB databases through `mongodump`.
-   Efficient compression of backup data with `tar` and `gzip`.
-   Secure uploads to Nextcloud using WebDAV protocol.
-   Configurable via environment variables for easy customization.
-   Cross-platform support (tested on Windows; requires MongoDB tools
    installed).
-   Clean temporary file management after backup completion.
-   Clear logging of each step for monitoring and troubleshooting.

------------------------------------------------------------------------

## Folder Structure

mongodb-backup/ ├── src/ │ ├── backup.js \# Main orchestrator script │
├── config.js \# Loads environment configuration │ └── utils/ \# Helper
modules (optional extension) ├── logs/ \# Logs directory ├── temp/ \#
Temporary dump and archive files ├── .env \# Environment variables ├──
package.json \# Bun dependencies ├── backup.sh \# Shell wrapper script
(for cron jobs) └── README.md \# Project documentation

text

------------------------------------------------------------------------

## Environment Configuration (`.env`)

Configure connection details and paths in your `.env` file:

MONGO_URI=mongodb+srv://username:password@host
NEXTCLOUD_URL=https://your.nextcloud.instance/remote.php/dav/files/username
NEXTCLOUD_USERNAME=your-username NEXTCLOUD_PASSWORD=your-password
NEXTCLOUD_BACKUP_PATH=/Mongodb-backup BACKUP_RETENTION_DAYS=1825
TEMP_DIR=./temp LOG_DIR=./logs

text

------------------------------------------------------------------------

## Prerequisites

-   MongoDB Database Tools installed (`mongodump` available in PATH or
    specify full path).
-   Bun.js runtime installed.
-   Access to a Nextcloud instance with WebDAV enabled.
-   `tar` and `gzip` available on the system (usually pre-installed on
    Linux; Windows users may need tools like Git Bash or WSL).

------------------------------------------------------------------------

## Installation

1.  Clone the repository.

2.  Install Bun dependencies:

bun install

text

3.  Configure `.env` variables as shown above.

4.  Ensure `mongodump` is installed and accessible in your system PATH
    or update the script with full path.

------------------------------------------------------------------------

## Usage

Run the backup script manually:

bun run src/backup.js

text

To automate backups, schedule the included `backup.sh` script using cron
or Windows Task Scheduler.

------------------------------------------------------------------------

## Troubleshooting

-   If `mongodump` not found error occurs, verify MongoDB tools are
    installed and in the PATH or set full path in `backup.js`.
-   Verify `.env` file is present and variables are correctly set.
-   Check logs for detailed output on failures.
-   Confirm Nextcloud WebDAV URL and credentials are valid.

------------------------------------------------------------------------
