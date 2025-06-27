import { PageLayout } from '@/components/cloud-drive/page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <PageLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Card>
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>This page is under construction.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Settings and profile management features will be available here in a future update.</p>
            </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
