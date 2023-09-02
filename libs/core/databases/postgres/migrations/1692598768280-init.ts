import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1692598768280 implements MigrationInterface {
  name = 'Init1692598768280';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "attendance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "date" date NOT NULL, "memberId" uuid, CONSTRAINT "PK_ee0ffe42c1f1a01e72b725c0cb2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."communicate_type_enum" AS ENUM('ANNOUNCEMENT', 'TEMPLATE', 'CUSTOMER', 'EVENT', 'POPUP', 'BOARD', 'RULE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "communicate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "content" character varying NOT NULL, "type" "public"."communicate_type_enum" NOT NULL, "fileUrl" character varying, "status" boolean NOT NULL DEFAULT false, "ipAddress" character varying, "applyDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "authorId" uuid, "parentId" uuid, CONSTRAINT "PK_43e73d6a42652609910844499d8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."memo-note_type_enum" AS ENUM('NOTE', 'MONEY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "memo-note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "content" character varying, "type" "public"."memo-note_type_enum" NOT NULL DEFAULT 'NOTE', "noteDate" TIMESTAMP, "memberId" uuid, CONSTRAINT "PK_c7998602fa7005dc06f3b752253" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post-message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(20) NOT NULL, "content" character varying NOT NULL, "confirmDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "senderId" uuid, "receiverId" uuid, CONSTRAINT "PK_5c962487a7735887e86d8b0cb61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."register-code_type_enum" AS ENUM('PARTNER', 'REFER_A_FRIEND')`,
    );
    await queryRunner.query(
      `CREATE TABLE "register-code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "bonus" numeric DEFAULT '0', "recommendCode" character varying NOT NULL, "type" "public"."register-code_type_enum" NOT NULL, "detail" character varying, "registeredDomain" character varying, "ownerId" uuid, CONSTRAINT "UQ_0533b155824be83f35f089bff4b" UNIQUE ("recommendCode"), CONSTRAINT "PK_3f5ce756fd4fb790db9ad66bef5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(20) NOT NULL, "description" character varying, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."deposit_status_enum" AS ENUM('0', '1')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."deposit_state_enum" AS ENUM('PENDING', 'APPROVE', 'REJECT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."deposit_type_enum" AS ENUM('SALARY', 'USER_DEPOSIT', 'ADMIN_DEPOSIT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."deposit_chargetype_enum" AS ENUM('FIRST_CHARGE', 'RECHARGE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "deposit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "amount" bigint NOT NULL, "total" bigint NOT NULL, "rechargeId" character varying DEFAULT '0', "firstChargeBonus" bigint DEFAULT '0', "reChargeBonus" bigint DEFAULT '0', "reChargeTime" bigint NOT NULL, "isBonusApply" boolean NOT NULL, "status" "public"."deposit_status_enum" NOT NULL, "state" "public"."deposit_state_enum" NOT NULL, "type" "public"."deposit_type_enum" NOT NULL, "chargeType" "public"."deposit_chargetype_enum", "ipAddress" character varying NOT NULL, "confirmDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "memberId" uuid, CONSTRAINT "PK_6654b4be449dadfd9d03a324b61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."withdrawal_status_enum" AS ENUM('0', '1')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."withdrawal_state_enum" AS ENUM('PENDING', 'APPROVE', 'REJECT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "withdrawal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "amount" bigint NOT NULL, "status" "public"."withdrawal_status_enum" NOT NULL, "state" "public"."withdrawal_state_enum" NOT NULL, "ipAddress" character varying NOT NULL, "confirmDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "memberId" uuid, CONSTRAINT "PK_840e247aaad3fbd4e18129122a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."member_gender_enum" AS ENUM('MALE', 'FEMALE', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "nickName" character varying(20) NOT NULL, "fullName" character varying(30) NOT NULL, "doB" TIMESTAMP, "gender" "public"."member_gender_enum" NOT NULL DEFAULT 'MALE', "email" character varying(50), "phone" character varying(20) NOT NULL, "level" integer NOT NULL DEFAULT '0', "group" character varying(1) NOT NULL DEFAULT 'A', "point" bigint NOT NULL DEFAULT '0', "coin" bigint NOT NULL DEFAULT '0', "verifiedEMail" boolean NOT NULL DEFAULT false, "verifiedPhone" boolean NOT NULL DEFAULT false, "address" character varying, "username" character varying(20) NOT NULL, "password" character varying(60) NOT NULL, "exchangePassword" character varying(60) NOT NULL, "money" bigint NOT NULL DEFAULT '0', "depositMoney" bigint NOT NULL DEFAULT '0', "withdrawMoney" bigint NOT NULL DEFAULT '0', "bankName" character varying, "bankOwnerName" character varying, "bankAccountNumber" character varying, "verified" boolean NOT NULL DEFAULT false, "isInterested" boolean NOT NULL DEFAULT false, "leaveDate" TIMESTAMP WITH TIME ZONE, "interceptDate" TIMESTAMP WITH TIME ZONE, "lastAccess" TIMESTAMP WITH TIME ZONE, "lastLoginIP" character varying, "roleId" uuid, "recommenderId" uuid, "recommendedCodeId" uuid, CONSTRAINT "UQ_caaa7c8f5ec452c828677abe125" UNIQUE ("nickName"), CONSTRAINT "UQ_1945f9202fcfbce1b439b47b77a" UNIQUE ("username"), CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bank-check" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "memberId" uuid, CONSTRAINT "PK_b822eddd1bee3cede0db060223e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."black-list_type_enum" AS ENUM('IP', 'MEMBER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "black-list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "detail" character varying, "ipAddress" character varying, "type" "public"."black-list_type_enum" NOT NULL, "memberId" uuid, CONSTRAINT "UQ_4a03f6f5c0f03a78941cf8e14b4" UNIQUE ("ipAddress"), CONSTRAINT "REL_930c764541f0e8a1bfa6234310" UNIQUE ("memberId"), CONSTRAINT "PK_93979f22a3f6a8e9893431988ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."coin-log_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."coin-log_source_enum" AS ENUM('SYSTEM', 'EXCHANGE', 'BUY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "coin-log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "memberId" uuid NOT NULL, "coin" bigint, "coinTotal" bigint, "reason" character varying(255) NOT NULL, "status" "public"."coin-log_status_enum" NOT NULL DEFAULT '0', "source" "public"."coin-log_source_enum" NOT NULL, "actionId" uuid NOT NULL, CONSTRAINT "PK_10c4f9aaac222ef14970bd4e996" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."coupon-log_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "coupon-log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "memberId" uuid NOT NULL, "status" "public"."coupon-log_status_enum" NOT NULL DEFAULT '0', "couponId" character varying NOT NULL, "usingTime" TIMESTAMP, CONSTRAINT "PK_3ea3487d5f1e7c8c32fa45fd7dc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "realtime-score" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "gameFeedId" uuid NOT NULL, "sportId" uuid NOT NULL, "statusCode" character varying NOT NULL, "homeTeamScore" integer NOT NULL, "awayTeamScore" integer NOT NULL, "note" character varying(255) NOT NULL, CONSTRAINT "REL_7faa962fecd7a8ac83d1e96efc" UNIQUE ("gameFeedId"), CONSTRAINT "PK_84c3fc84f97f24700e0fb0b2ee8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "game_idx" ON "realtime-score" ("gameFeedId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6ff0e30884336ce87d75b25651" ON "realtime-score" ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."game-feed_type_enum" AS ENUM('PRE_MATCH', 'IN_PLAY')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."game-feed_matchstatus_enum" AS ENUM('NOT_YET', 'INPROGRESS', 'INTERRUPTED', 'FINISHED', 'NOT_AVAILABLE', 'ABANDONED', 'POSTPONED', 'RESULTED', 'CANCELED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."game-feed_eventstatus_enum" AS ENUM('OPEN', 'CLOSED', 'ABANDONED', 'SUSPENDED', 'RESULTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "game-feed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "fid" character varying NOT NULL, "sportId" uuid NOT NULL, "sportName" character varying(100) NOT NULL, "leagueId" uuid NOT NULL, "leagueName" character varying(100) NOT NULL, "nationId" uuid NOT NULL, "nationName" character varying(100) NOT NULL, "homeTeam" character varying(100) NOT NULL, "homeTeamId" uuid NOT NULL, "awayTeam" character varying(100) NOT NULL, "awayTeamId" uuid NOT NULL, "type" "public"."game-feed_type_enum" NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP, "matchStatus" "public"."game-feed_matchstatus_enum" NOT NULL, "eventStatus" "public"."game-feed_eventstatus_enum" NOT NULL, CONSTRAINT "UQ_f08752afdc5d12c64668d71e085" UNIQUE ("fid"), CONSTRAINT "PK_0c4ddfee3537839f0a0ce24a059" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b7f869c9c731b268b6e3ac462d" ON "game-feed" ("createdAt", "updatedAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "startTimeIdx" ON "game-feed" ("startTime") `,
    );
    await queryRunner.query(
      `CREATE INDEX "sportIdx" ON "game-feed" ("sportId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "nationIdx" ON "game-feed" ("nationId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "leagueIdx" ON "game-feed" ("leagueId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "awayTeamIdx" ON "game-feed" ("awayTeam") `,
    );
    await queryRunner.query(
      `CREATE INDEX "homeTeamIdx" ON "game-feed" ("homeTeam") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "gameFeedIdx" ON "game-feed" ("id", "fid") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."market_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."market_type_enum" AS ENUM('OVER', 'UNDER', 'OVER_UNDER', 'HANDICAP', 'WIN_LOSE', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "market" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(50) NOT NULL, "nameKo" character varying(50), "order" integer NOT NULL DEFAULT '0', "status" "public"."market_status_enum" NOT NULL DEFAULT '1', "type" "public"."market_type_enum", "score" integer NOT NULL DEFAULT '900', "marketConfigId" character varying(50), CONSTRAINT "UQ_1aeb3f3714d39ebc4697c220e97" UNIQUE ("name"), CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f8d9e42f63aeccf12663beb29a" ON "market" ("name", "order") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."game-detail_status_enum" AS ENUM('PENDING', 'OPEN', 'CLOSE', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "game-detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "gameFeedId" uuid NOT NULL, "marketId" uuid NOT NULL, "homeTeamId" uuid NOT NULL, "awayTeamId" uuid NOT NULL, "status" "public"."game-detail_status_enum" NOT NULL DEFAULT 'PENDING', "name" character varying(50) NOT NULL, "odds" double precision NOT NULL, "bodds" double precision NOT NULL, "codds" double precision NOT NULL, "handicap" character varying, CONSTRAINT "PK_24c9b513ce445f8c6d826e6c0e7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_88b4e46ed5f4b964f511251ac9" ON "game-detail" ("createdAt", "updatedAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "awayTeam_idx" ON "game-detail" ("awayTeamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "homeTeam_idx" ON "game-detail" ("homeTeamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "market_idx" ON "game-detail" ("marketId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "name_idx" ON "game-detail" ("name") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."league_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "league" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(100) NOT NULL, "nameKo" character varying(100), "order" integer NOT NULL, "status" "public"."league_status_enum" NOT NULL DEFAULT '1', "season" character varying(50) NOT NULL, "sportId" uuid NOT NULL, "nationId" uuid NOT NULL, "imageUrl" character varying, CONSTRAINT "leagueUnique" UNIQUE ("name", "season"), CONSTRAINT "PK_0bd74b698f9e28875df738f7864" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c5a77295f3c5ccbd1c104eacd2" ON "league" ("name", "order") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."money-log_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."money-log_source_enum" AS ENUM('DEPOSIT', 'WITHDRAW', 'ORDER', 'REFERENCE', 'WIN', 'LOSS', 'REFUND', 'SYSTEM', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "money-log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "memberId" uuid NOT NULL, "money" bigint NOT NULL, "moneyTotal" bigint NOT NULL, "reason" character varying(255) NOT NULL DEFAULT '[운영자]', "status" "public"."money-log_status_enum" NOT NULL DEFAULT '0', "source" "public"."money-log_source_enum" NOT NULL, "actionId" uuid NOT NULL, CONSTRAINT "PK_11e85fd5a6d505209fcd58ad46e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."nation_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "nation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(100) NOT NULL, "nameKo" character varying(100), "status" "public"."nation_status_enum" NOT NULL DEFAULT '1', "order" integer NOT NULL DEFAULT '0', "imageUrl" character varying, CONSTRAINT "UQ_88f486ebf11b412463de3ae9438" UNIQUE ("name"), CONSTRAINT "PK_923ae06a2be81addedb0aff5f02" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_96f818e72af340d5c814077f3c" ON "nation" ("name", "order") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."point-log_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."point-log_type_enum" AS ENUM('POSITIVE', 'NEGATIVE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."point-log_source_enum" AS ENUM('DEPOSIT', 'ORDER', 'EXCHANGE', 'REFERENCE', 'EVENT', 'SYSTEM', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "point-log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "memberId" uuid NOT NULL, "point" bigint NOT NULL, "pointTotal" bigint NOT NULL, "reason" character varying(255) NOT NULL DEFAULT '[운영자]', "status" "public"."point-log_status_enum" NOT NULL DEFAULT '0', "type" "public"."point-log_type_enum" NOT NULL, "source" "public"."point-log_source_enum" NOT NULL, "actionId" uuid NOT NULL, CONSTRAINT "PK_57ed833d0ebb36c8a2134949e80" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sport_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sport" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(100) NOT NULL, "nameKo" character varying(100), "status" "public"."sport_status_enum" NOT NULL DEFAULT '1', "order" integer NOT NULL DEFAULT '0', "imageUrl" character varying, CONSTRAINT "UQ_6a16e1d83cb581484036cee92bf" UNIQUE ("name"), CONSTRAINT "PK_c67275331afac347120a1032825" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e5263234367f1e88e94897c2fb" ON "sport" ("name", "order") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."team_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "team" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(100) NOT NULL, "nameKo" character varying(100), "leagueId" uuid NOT NULL, "status" "public"."team_status_enum" NOT NULL DEFAULT '1', "order" integer NOT NULL DEFAULT '0', "imageUrl" character varying, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0fbb40458e3abb2e74076f075a" ON "team" ("name", "leagueId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance" ADD CONSTRAINT "FK_24f01ca59f0e454daa2de25acbd" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communicate" ADD CONSTRAINT "FK_2a157c22bd05469ee9625e9049b" FOREIGN KEY ("authorId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communicate" ADD CONSTRAINT "FK_eec3335f1a3fb24fcd3a966f89d" FOREIGN KEY ("parentId") REFERENCES "communicate"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "memo-note" ADD CONSTRAINT "FK_978549f9e29ecbf27cd0b4b0598" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post-message" ADD CONSTRAINT "FK_e2d0ba433f803d0d038ca65686b" FOREIGN KEY ("senderId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post-message" ADD CONSTRAINT "FK_75accf2ea41a79d7de0d7b5b234" FOREIGN KEY ("receiverId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "register-code" ADD CONSTRAINT "FK_e4fbb64adac13581205f4a1465a" FOREIGN KEY ("ownerId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deposit" ADD CONSTRAINT "FK_83110426b6360ba29aae82bdd93" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdrawal" ADD CONSTRAINT "FK_2540f52dd5c32b957b7d5f5c05e" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_ce159f87a1a69d5c4bb9dbb2b55" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_2c5233089e04f3825839eeaa741" FOREIGN KEY ("recommenderId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_0f7e7535c87033ec8faa35f6abb" FOREIGN KEY ("recommendedCodeId") REFERENCES "register-code"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank-check" ADD CONSTRAINT "FK_206e30cf85435dcb9c2a7ef0a8a" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "black-list" ADD CONSTRAINT "FK_930c764541f0e8a1bfa6234310a" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin-log" ADD CONSTRAINT "FK_9da084adec1646cc252dd856fc8" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin-log" ADD CONSTRAINT "FK_d8bc416782fc89653f073865c82" FOREIGN KEY ("actionId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "coupon-log" ADD CONSTRAINT "FK_73f0936ca19b4b5865594198344" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "realtime-score" ADD CONSTRAINT "FK_7faa962fecd7a8ac83d1e96efca" FOREIGN KEY ("gameFeedId") REFERENCES "game-feed"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-detail" ADD CONSTRAINT "FK_e00bb65ad7ea1a4e5811db40c76" FOREIGN KEY ("gameFeedId") REFERENCES "game-feed"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-detail" ADD CONSTRAINT "FK_dcfd9ff9e9c697f93403c0d6862" FOREIGN KEY ("marketId") REFERENCES "market"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "money-log" ADD CONSTRAINT "FK_0b7468ca3ac5be821d85e83e015" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "money-log" ADD CONSTRAINT "FK_19f629e9fe650d186c293153663" FOREIGN KEY ("actionId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "point-log" ADD CONSTRAINT "FK_28f0e3762738cb2f3cc0032557a" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "point-log" ADD CONSTRAINT "FK_8e76b5a77021824a8d50dc9b53f" FOREIGN KEY ("actionId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "point-log" DROP CONSTRAINT "FK_8e76b5a77021824a8d50dc9b53f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "point-log" DROP CONSTRAINT "FK_28f0e3762738cb2f3cc0032557a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "money-log" DROP CONSTRAINT "FK_19f629e9fe650d186c293153663"`,
    );
    await queryRunner.query(
      `ALTER TABLE "money-log" DROP CONSTRAINT "FK_0b7468ca3ac5be821d85e83e015"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-detail" DROP CONSTRAINT "FK_dcfd9ff9e9c697f93403c0d6862"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-detail" DROP CONSTRAINT "FK_e00bb65ad7ea1a4e5811db40c76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "realtime-score" DROP CONSTRAINT "FK_7faa962fecd7a8ac83d1e96efca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coupon-log" DROP CONSTRAINT "FK_73f0936ca19b4b5865594198344"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin-log" DROP CONSTRAINT "FK_d8bc416782fc89653f073865c82"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coin-log" DROP CONSTRAINT "FK_9da084adec1646cc252dd856fc8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "black-list" DROP CONSTRAINT "FK_930c764541f0e8a1bfa6234310a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank-check" DROP CONSTRAINT "FK_206e30cf85435dcb9c2a7ef0a8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_0f7e7535c87033ec8faa35f6abb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_2c5233089e04f3825839eeaa741"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_ce159f87a1a69d5c4bb9dbb2b55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdrawal" DROP CONSTRAINT "FK_2540f52dd5c32b957b7d5f5c05e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deposit" DROP CONSTRAINT "FK_83110426b6360ba29aae82bdd93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "register-code" DROP CONSTRAINT "FK_e4fbb64adac13581205f4a1465a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post-message" DROP CONSTRAINT "FK_75accf2ea41a79d7de0d7b5b234"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post-message" DROP CONSTRAINT "FK_e2d0ba433f803d0d038ca65686b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "memo-note" DROP CONSTRAINT "FK_978549f9e29ecbf27cd0b4b0598"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communicate" DROP CONSTRAINT "FK_eec3335f1a3fb24fcd3a966f89d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communicate" DROP CONSTRAINT "FK_2a157c22bd05469ee9625e9049b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance" DROP CONSTRAINT "FK_24f01ca59f0e454daa2de25acbd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0fbb40458e3abb2e74076f075a"`,
    );
    await queryRunner.query(`DROP TABLE "team"`);
    await queryRunner.query(`DROP TYPE "public"."team_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e5263234367f1e88e94897c2fb"`,
    );
    await queryRunner.query(`DROP TABLE "sport"`);
    await queryRunner.query(`DROP TYPE "public"."sport_status_enum"`);
    await queryRunner.query(`DROP TABLE "point-log"`);
    await queryRunner.query(`DROP TYPE "public"."point-log_source_enum"`);
    await queryRunner.query(`DROP TYPE "public"."point-log_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."point-log_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_96f818e72af340d5c814077f3c"`,
    );
    await queryRunner.query(`DROP TABLE "nation"`);
    await queryRunner.query(`DROP TYPE "public"."nation_status_enum"`);
    await queryRunner.query(`DROP TABLE "money-log"`);
    await queryRunner.query(`DROP TYPE "public"."money-log_source_enum"`);
    await queryRunner.query(`DROP TYPE "public"."money-log_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c5a77295f3c5ccbd1c104eacd2"`,
    );
    await queryRunner.query(`DROP TABLE "league"`);
    await queryRunner.query(`DROP TYPE "public"."league_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."name_idx"`);
    await queryRunner.query(`DROP INDEX "public"."market_idx"`);
    await queryRunner.query(`DROP INDEX "public"."homeTeam_idx"`);
    await queryRunner.query(`DROP INDEX "public"."awayTeam_idx"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_88b4e46ed5f4b964f511251ac9"`,
    );
    await queryRunner.query(`DROP TABLE "game-detail"`);
    await queryRunner.query(`DROP TYPE "public"."game-detail_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f8d9e42f63aeccf12663beb29a"`,
    );
    await queryRunner.query(`DROP TABLE "market"`);
    await queryRunner.query(`DROP TYPE "public"."market_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."market_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."gameFeedIdx"`);
    await queryRunner.query(`DROP INDEX "public"."homeTeamIdx"`);
    await queryRunner.query(`DROP INDEX "public"."awayTeamIdx"`);
    await queryRunner.query(`DROP INDEX "public"."leagueIdx"`);
    await queryRunner.query(`DROP INDEX "public"."nationIdx"`);
    await queryRunner.query(`DROP INDEX "public"."sportIdx"`);
    await queryRunner.query(`DROP INDEX "public"."startTimeIdx"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b7f869c9c731b268b6e3ac462d"`,
    );
    await queryRunner.query(`DROP TABLE "game-feed"`);
    await queryRunner.query(`DROP TYPE "public"."game-feed_eventstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."game-feed_matchstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."game-feed_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6ff0e30884336ce87d75b25651"`,
    );
    await queryRunner.query(`DROP INDEX "public"."game_idx"`);
    await queryRunner.query(`DROP TABLE "realtime-score"`);
    await queryRunner.query(`DROP TABLE "coupon-log"`);
    await queryRunner.query(`DROP TYPE "public"."coupon-log_status_enum"`);
    await queryRunner.query(`DROP TABLE "coin-log"`);
    await queryRunner.query(`DROP TYPE "public"."coin-log_source_enum"`);
    await queryRunner.query(`DROP TYPE "public"."coin-log_status_enum"`);
    await queryRunner.query(`DROP TABLE "black-list"`);
    await queryRunner.query(`DROP TYPE "public"."black-list_type_enum"`);
    await queryRunner.query(`DROP TABLE "bank-check"`);
    await queryRunner.query(`DROP TABLE "member"`);
    await queryRunner.query(`DROP TYPE "public"."member_gender_enum"`);
    await queryRunner.query(`DROP TABLE "withdrawal"`);
    await queryRunner.query(`DROP TYPE "public"."withdrawal_state_enum"`);
    await queryRunner.query(`DROP TYPE "public"."withdrawal_status_enum"`);
    await queryRunner.query(`DROP TABLE "deposit"`);
    await queryRunner.query(`DROP TYPE "public"."deposit_chargetype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."deposit_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."deposit_state_enum"`);
    await queryRunner.query(`DROP TYPE "public"."deposit_status_enum"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "register-code"`);
    await queryRunner.query(`DROP TYPE "public"."register-code_type_enum"`);
    await queryRunner.query(`DROP TABLE "post-message"`);
    await queryRunner.query(`DROP TABLE "memo-note"`);
    await queryRunner.query(`DROP TYPE "public"."memo-note_type_enum"`);
    await queryRunner.query(`DROP TABLE "communicate"`);
    await queryRunner.query(`DROP TYPE "public"."communicate_type_enum"`);
    await queryRunner.query(`DROP TABLE "attendance"`);
  }
}
