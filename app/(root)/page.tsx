import Image from 'next/image';
import Link from 'next/link';
import { Models } from 'node-appwrite';

import ActionDropdown from '@/components/ActionDropdown';
import { Chart } from '@/components/Chart';
import FormattedDateTime from '@/components/FormattedDateTime';
import { Thumbnail } from '@/components/Thumbnail';
import { Separator } from '@/components/ui/separator';
import { getFiles, getTotalSpaceUsed } from '@/lib/actions/file.actions';
import { convertFileSize, getUsageSummary } from '@/lib/utils';

const Dashboard = async () => {
  // Parallel requests
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }), // Fetch the recent files
    getTotalSpaceUsed(),
  ]);

  const recentFiles = files.documents || []; // Ensure safe access to documents
  const usageSummary = getUsageSummary(totalSpace); // Get usage summary

  return (
    <div className="dashboard-container">
      <section>
        <Chart used={totalSpace.used} />

        {/* Uploaded file type summaries */}
        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt="uploaded image"
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>

                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      {/* Recent Files Section */}
      <section className="dashboard-recent-files">
        <h4 className="text-xl font-bold mb-4">Recent Files</h4>
        {recentFiles.length > 0 ? (
          <ul>
            {recentFiles.map((file: Models.Document) => (
              <li key={file.$id} className="recent-file-details mb-4">
                <div className="flex items-center">
                  <Thumbnail type={file.type} extension={file.extension} url={file.url} className="size-9 min-w-9"/>
                  <span className="recent-file-name ml-4">{file.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <FormattedDateTime
                    date={file.$createdAt}
                    className="recent-file-date"
                  />
                  <ActionDropdown file={file} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No recent files uploaded.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
