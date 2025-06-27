import { PageLayout } from '@/components/cloud-drive/page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function StoragePage() {
  return (
    <PageLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Storage</h1>
        <Card>
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>This page is under construction.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Detailed storage management features will be available here in a future update.</p>
            </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
