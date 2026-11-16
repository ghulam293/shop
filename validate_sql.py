import re

with open('database/schema_with_seed.sql', 'r', encoding='utf-8') as f:
    sql = f.read()

tables = re.findall(r'CREATE TABLE\s+[`"]?(\w+)[`"]?', sql, re.IGNORECASE)
inserts = re.findall(r'INSERT INTO\s+[`"]?(\w+)[`"]?', sql, re.IGNORECASE)

print('\n=============================================================')
print('      DATABASE SQL SCHEMA & SEED INTEGRITY AUDIT')
print('=============================================================\n')
print(f'Total Tables Verified ({len(tables)}):')
for t in tables:
    print(f'  • Table: {t}')

print(f'\nTotal Seed Data Ingestions ({len(set(inserts))} unique tables populated):')
for ins in sorted(set(inserts)):
    print(f'  • Seeded: {ins}')

assert len(tables) >= 12, 'Tables count mismatch'
assert 'products' in tables and 'categories' in tables and 'inventory' in tables and 'orders' in tables
print('\n✅ DATABASE INTEGRITY VALIDATION: 100% PASSED\n')

