import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ScoringGuide = () => {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="container mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">BEAM Score Guide</h1>
          <p className="text-muted-foreground">
            Understanding our comprehensive lead scoring methodology
          </p>
        </div>

        {/* Overview Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="mb-4">
            The BEAM Score (Business Engagement & Authority Matrix) is our
            comprehensive lead scoring system that evaluates leads across four key
            dimensions, with each component contributing up to 25 points for a
            total maximum score of 100.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Components</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>BANT Evaluation (25 points)</li>
                <li>Engagement Metrics (25 points)</li>
                <li>Account Characteristics (25 points)</li>
                <li>Market Signals (25 points)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* BANT Score */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">BANT Score (25 points)</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Budget Range</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Enterprise ($100k+): 7 points</li>
                    <li>Mid-Market ($50k-$100k): 5 points</li>
                    <li>Small Business ($10k-$50k): 3 points</li>
                    <li>Startup (Under $10k): 1 point</li>
                  </ul>
                </TableCell>
                <TableCell>7</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Authority Level</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>C-Level: 6 points</li>
                    <li>VP/Director: 4 points</li>
                    <li>Manager: 2 points</li>
                  </ul>
                </TableCell>
                <TableCell>6</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Need Urgency</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Immediate Need: 6 points</li>
                    <li>Next Quarter: 4 points</li>
                    <li>Future: 2 points</li>
                  </ul>
                </TableCell>
                <TableCell>6</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Timeline</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Immediate Start: 6 points</li>
                    <li>1-3 Months: 4 points</li>
                    <li>3+ Months: 2 points</li>
                  </ul>
                </TableCell>
                <TableCell>6</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* Engagement Score */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Engagement Score (25 points)
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Call Interactions</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>6+ calls: 10 points</li>
                    <li>3-5 calls: 6 points</li>
                    <li>1-2 calls: 3 points</li>
                    <li>No calls: 0 points</li>
                  </ul>
                </TableCell>
                <TableCell>10</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Email Quality</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Business email: 8 points</li>
                    <li>Personal email: 4 points</li>
                    <li>Other: 2 points</li>
                    <li>No email: 0 points</li>
                  </ul>
                </TableCell>
                <TableCell>8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Message Quality</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Detailed message: 7 points</li>
                    <li>Basic message: 4 points</li>
                    <li>No message: 0 points</li>
                  </ul>
                </TableCell>
                <TableCell>7</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* Account Score */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Account Score (25 points)
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Company Size</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Enterprise: 10 points</li>
                    <li>Mid-Market: 7 points</li>
                    <li>Small Business: 4 points</li>
                    <li>Startup: 2 points</li>
                  </ul>
                </TableCell>
                <TableCell>10</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Industry Vertical</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>High-priority (Tech, Healthcare, Finance): 8 points</li>
                    <li>Medium-priority (Manufacturing, Services): 5 points</li>
                    <li>Other industries: 3 points</li>
                  </ul>
                </TableCell>
                <TableCell>8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Annual Revenue</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>$100M+: 7 points</li>
                    <li>$50M-$100M: 5 points</li>
                    <li>$10M-$50M: 3 points</li>
                    <li>Under $10M: 1 point</li>
                  </ul>
                </TableCell>
                <TableCell>7</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* Market Score */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Market Score (25 points)</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Geographic Location</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Tier 1 (USA, UK, Canada): 10 points</li>
                    <li>Tier 2 (Europe, Australia, Japan): 8 points</li>
                    <li>Tier 3 (Other developed markets): 5 points</li>
                    <li>Tier 4 (Emerging markets): 3 points</li>
                  </ul>
                </TableCell>
                <TableCell>10</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Contact Completeness</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>Has phone number: 4 points</li>
                    <li>Has complete address: 4 points</li>
                  </ul>
                </TableCell>
                <TableCell>8</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Technology Stack</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    <li>5+ technologies: 7 points</li>
                    <li>3-4 technologies: 5 points</li>
                    <li>1-2 technologies: 3 points</li>
                    <li>No technologies: 0 points</li>
                  </ul>
                </TableCell>
                <TableCell>7</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        {/* Score Interpretation */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Score Interpretation</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Score Range</TableHead>
                <TableHead>Classification</TableHead>
                <TableHead>Recommended Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>80-100</TableCell>
                <TableCell>Hot Lead</TableCell>
                <TableCell>
                  Immediate follow-up, high-touch engagement
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>60-79</TableCell>
                <TableCell>Warm Lead</TableCell>
                <TableCell>
                  Regular follow-up, relationship building
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>40-59</TableCell>
                <TableCell>Nurture Lead</TableCell>
                <TableCell>
                  Educational content, periodic check-ins
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>0-39</TableCell>
                <TableCell>Cold Lead</TableCell>
                <TableCell>
                  Automated nurturing, reassess fit
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default ScoringGuide;